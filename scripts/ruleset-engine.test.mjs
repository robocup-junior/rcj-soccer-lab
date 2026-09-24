import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      /^\.\.?\//.test(specifier) &&
      context.parentURL?.includes('/lib/') &&
      !/\.(ts|json)$/.test(specifier)
    )
      return nextResolve(`${specifier}.ts`, context);
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.json') && url.includes('/lib/'))
      return {
        format: 'module',
        shortCircuit: true,
        source: `export default ${readFileSync(new URL(url), 'utf8')}`,
      };
    if (url.endsWith('.ts') && url.includes('/lib/'))
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
      };
    return nextLoad(url, context);
  },
});

const { runDeterministicSession } = await import('./ruleset-engine-driver.mjs');
const golden = JSON.parse(
  readFileSync(new URL('./ruleset-engine-golden.json', import.meta.url)),
);

// These hashes were recorded from the engine BEFORE rule-set support existed.
// Certification replays are re-verified with this engine, so its behaviour
// under the 2026 rules must never change. If this fails, a rule-set change
// leaked into the 2026 path; do not regenerate the file to make it pass.
for (const entry of golden) {
  const { hash, report, calls, score, ...options } = entry;
  test(`2026 adjudication is unchanged: ${options.mode} seed ${options.seed} (${options.policy})`, () => {
    for (const rulesetId of [undefined, '2026', 'not-a-rule-set']) {
      const result = runDeterministicSession({ ...options, rulesetId });
      assert.deepEqual(result.report, report);
      assert.deepEqual(result.score, score);
      assert.equal(result.calls, calls);
      assert.equal(result.hash, hash);
    }
  });
}

// ---------------------------------------------------------------------------
// Behaviour that the 2027 draft changes, side by side with the 2026 rules.
// ---------------------------------------------------------------------------
const { RefereeMatch } = await import('../lib/simulator/referee-match.ts');
const { REFEREE_CASES, caseScene, findRefereeCase, ruleUrl } =
  await import('../lib/simulator/referee-cases.ts');
const { MATCH_ROBOTS, MATCH_STEP } = await import('../lib/simulator/match.ts');
const { RCJ_FIELD_DERIVED: FIELD, RCJ_FIELD_SPEC_2026: SPEC } =
  await import('../lib/simulator/field-spec.ts');
const {
  clampRobotToField,
  ownCornerSpots,
  projectRobotFootprint,
  pushingLinePath,
  pushingLineZ,
  robotOnRamp,
  robotPenaltyOverlap,
  robotReachesPushingLine,
  robotTouchesFieldWall,
} = await import('../lib/simulator/referee-geometry.ts');
const { ROBOT_VISUALS } = await import('../lib/simulator/robot-models.ts');
const { NEUTRAL_SPOTS, sampleClip } =
  await import('../lib/rulebook/animations.ts');
const { learningBank } = await import('../lib/rulebook/learning-bank.ts');
const { gameplayRulesFor, CERTIFICATION_RULESET_ID } =
  await import('../lib/rulesets/gameplay.ts');
const { rulesForDecision } = await import('../lib/simulator/referee-rules.ts');

const plain = { swap: false, reflect: false };
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const bankCase = (rulesetId, id) =>
  learningBank(rulesetId).cases.find((item) => item.id === id);
const advance = (session, seconds) => {
  for (let i = 0; i < Math.ceil(seconds / MATCH_STEP); i++) session.step();
};
function continuous(rulesetId, options = {}) {
  const session = new RefereeMatch(73, {
    mode: 'continuous',
    duration: 600,
    rulesetId,
    ...options,
  });
  session.director.delay = Infinity; // only the staged situation is observed
  return session;
}
function drill(rulesetId, id, { robotVisual, transform = plain } = {}) {
  const session = new RefereeMatch(2026, { robotVisual, rulesetId });
  const definition = bankCase(rulesetId, id);
  assert.ok(definition, `${rulesetId} has case ${id}`);
  assert.equal(session.beginCase(definition, transform), true);
  for (let i = 0; i < 2400 && session.phase === 'evidence'; i++) session.step();
  assert.equal(session.phase, 'decision', id);
  return session;
}
function submit(session, action, target) {
  assert.equal(session.submit(session.decisionKey, { action, target }), true);
  return session.snapshot().feedback;
}
/** Answers a drill exactly like the lesson UI: observe, call, continue. */
function solve(session, label) {
  const calls = [];
  for (let guard = 0; guard < 120 * 240; guard++) {
    const frame = session.snapshot();
    if (frame.feedback) {
      assert.ok(
        ['correct', 'supported'].includes(frame.feedback.verdict),
        `${label}: ${frame.feedback.detail}`,
      );
      assert.ok(frame.feedback.appliedRules.length > 0, label);
      if (frame.feedback.final) return calls;
      session.continue();
      continue;
    }
    if (frame.phase === 'evidence' || frame.count !== null) {
      assert.ok(session.canAdvance, `${label} must advance`);
      session.step();
      continue;
    }
    const choice = session.acceptedCalls()[0];
    assert.ok(choice, `${label} offers an accepted call`);
    calls.push(`${choice.action}${choice.target ? `:${choice.target}` : ''}`);
    assert.equal(session.submit(frame.decisionKey, choice), true);
  }
  assert.fail(`${label} did not finish`);
}

test('an unknown or missing rule set adjudicates with the certification rules', () => {
  assert.equal(CERTIFICATION_RULESET_ID, '2026');
  for (const id of [undefined, null, '', '1999', {}])
    assert.equal(new RefereeMatch(5, { rulesetId: id }).rulesetId, '2026');
  assert.equal(new RefereeMatch(5, { rulesetId: '2027' }).rulesetId, '2027');
  assert.equal(new RefereeMatch(5).snapshot().rulesetId, '2026');
  assert.deepEqual(gameplayRulesFor('nope'), gameplayRulesFor('2026'));
  assert.throws(() => {
    gameplayRulesFor('2027').pushing.lineDepth = 0.2;
  }, 'resolved parameters are frozen');
});

test('2027 only overrides what the draft changes', () => {
  const before = gameplayRulesFor('2026');
  const after = gameplayRulesFor('2027');
  assert.equal(before.outOfBounds.penaltySeconds, 60);
  assert.equal(after.outOfBounds.penaltySeconds, 60, 'inherited, not restated');
  assert.deepEqual(
    [
      before.outOfBounds.kickoffEndsPenaltyEarly,
      before.outOfBounds.returnNeedsInterruption,
      before.outOfBounds.returnPlacement,
      before.outOfBounds.voidGoals,
      before.outOfBounds.pushedOntoRampWaivable,
      before.multipleDefense.areas,
      before.pushing.basis,
      before.holding.consequence,
      before.lackOfProgress.returnServedRobotsFirst,
      before.kickoff.neutralWhenAllRobotsOut,
      before.lateTeam.automaticLossAtGoals,
      before.kickerTest.procedure,
    ],
    [
      true,
      false,
      'furthest-neutral-spot',
      'penalized-team',
      false,
      'any',
      'discretion',
      'inspect',
      false,
      false,
      null,
      'goal-rebound',
    ],
  );
  assert.deepEqual(
    [
      after.outOfBounds.kickoffEndsPenaltyEarly,
      after.outOfBounds.returnNeedsInterruption,
      after.outOfBounds.returnPlacement,
      after.outOfBounds.voidGoals,
      after.outOfBounds.pushedOntoRampWaivable,
      after.multipleDefense.areas,
      after.pushing.basis,
      after.holding.consequence,
      after.lackOfProgress.returnServedRobotsFirst,
      after.kickoff.neutralWhenAllRobotsOut,
      after.lateTeam.automaticLossAtGoals,
      after.kickerTest.procedure,
      after.kickerTest.maximumHeight,
    ],
    [
      false,
      true,
      'own-corner',
      'penalized-robot',
      true,
      'own',
      'line',
      'damaged',
      true,
      true,
      10,
      'vertical-height',
      1,
    ],
  );
  assert.equal(after.pushing.lineProvisional, true);
  assert.ok(after.pushing.lineDepth > 0);
  assert.ok(after.pushing.lineDepth < SPEC.penaltyArea.depth);
});

test('pushing-line geometry follows the visible body of every robot model', () => {
  const depth = gameplayRulesFor('2027').pushing.lineDepth;
  const line = pushingLineZ(depth);
  assert.ok(Math.abs(line - (FIELD.penaltyFrontCenterZ + depth)) < 1e-12);
  for (const { id: visual } of ROBOT_VISUALS)
    for (const end of [-1, 1]) {
      const at = (z, x = 0, yaw = end === 1 ? Math.PI : 0) => ({
        x,
        z: end * z,
        yaw,
      });
      // Facing up-field, the rear of the body is the part that reaches the line.
      assert.equal(
        robotReachesPushingLine(at(line - 0.12), end, depth, visual),
        false,
        `${visual} 12 cm short`,
      );
      assert.equal(
        robotReachesPushingLine(at(line - 0.06), end, depth, visual),
        true,
        `${visual} body over the line`,
      );
      assert.equal(
        robotReachesPushingLine(at(line + 0.02), end, depth, visual),
        true,
        `${visual} beyond the line`,
      );
      // The line is only drawn inside the area: beside it nothing is reached.
      assert.equal(
        robotReachesPushingLine(
          at(line, SPEC.penaltyArea.width / 2 + 0.15),
          end,
          depth,
          visual,
        ),
        false,
        `${visual} beside the area`,
      );
      // The other end's line is irrelevant.
      assert.equal(
        robotReachesPushingLine(at(line), -end, depth, visual),
        false,
      );
    }
});

test('provisional curve is the white centreline translated 16 cm and clipped at each goal', () => {
  const depth = gameplayRulesFor('2027').pushing.lineDepth;
  assert.equal(depth, 0.16);
  for (const end of [-1, 1]) {
    const path = pushingLinePath(end, depth);
    assert.ok(path.length > 60);
    for (const [x, z] of path) {
      assert.ok(z * end <= FIELD.penaltyBackEdgeZ + 1e-12);
      const dx = Math.max(0, Math.abs(x) - FIELD.penaltyArcCenterX);
      const whiteZ =
        FIELD.penaltyArcCenterZ -
        Math.sqrt(FIELD.penaltyStrokeRadius ** 2 - dx ** 2);
      assert.ok(Math.abs(z * end - whiteZ - 0.16) < 1e-12);
    }
    assert.ok(Math.abs(path[0][1] * end - FIELD.penaltyBackEdgeZ) < 1e-12);
    assert.ok(Math.abs(path.at(-1)[1] * end - FIELD.penaltyBackEdgeZ) < 1e-12);
    // Same depth, but a body near the curved side has not reached it yet.
    const pose = {
      x: 0,
      z: end * (pushingLineZ(depth) - 0.08),
      yaw: end === 1 ? Math.PI : 0,
    };
    assert.equal(robotReachesPushingLine(pose, end, depth, 'lab'), true);
    assert.equal(
      robotReachesPushingLine({ ...pose, x: 0.36 }, end, depth, 'lab'),
      false,
    );
  }
});

test('ramp and own-corner helpers', () => {
  for (const { id: visual } of ROBOT_VISUALS) {
    const touching = clampRobotToField(
      { x: FIELD.floorHalfWidth, z: 0, yaw: 0 },
      visual,
    );
    assert.equal(robotOnRamp(touching, visual), true);
    assert.equal(
      robotOnRamp({ ...touching, x: touching.x - 0.05 }, visual),
      true,
      'on the wedge without wall contact',
    );
    assert.equal(
      robotTouchesFieldWall({ ...touching, x: touching.x - 0.05 }, visual),
      false,
    );
    assert.equal(
      robotOnRamp(
        { ...touching, x: touching.x - SPEC.wedge.run - 0.01 },
        visual,
      ),
      false,
    );
    for (const end of [-1, 1])
      for (const spot of ownCornerSpots(end)) {
        assert.equal(Math.sign(spot.z), end);
        assert.equal(robotOnRamp(spot, visual), false);
        assert.equal(robotTouchesFieldWall(spot, visual), false);
        for (const polygon of projectRobotFootprint(spot, visual))
          for (const [x, z] of polygon.outer) {
            assert.ok(
              Math.abs(x) <
                FIELD.playingHalfWidth - SPEC.markings.whiteLineWidth,
            );
            assert.ok(
              Math.abs(z) <
                FIELD.playingHalfLength - SPEC.markings.whiteLineWidth,
            );
          }
        for (const area of [-1, 1])
          assert.equal(robotPenaltyOverlap(spot, area, visual), false);
        for (const neutral of NEUTRAL_SPOTS)
          assert.ok(distance(spot, neutral) > 0.205);
        // Facing its own goal, as specified by the September 24 draft.
        assert.ok(
          Math.abs(
            spot.yaw -
              Math.atan2(-spot.x, end * FIELD.goalBackInnerFaceZ - spot.z),
          ) < 1e-9,
        );
      }
  }
});

test('out of bounds: a kickoff before the minute returns the robot in 2026 only', () => {
  for (const [rulesetId, expected] of [
    ['2026', 'return'],
    ['2027', 'keep-out'],
  ]) {
    const session = continuous(rulesetId);
    assert.match(session.remove('blue-1', 'Out of bounds'), /removed/);
    advance(session, 25);
    // A goal makes a kickoff due.
    session.kickoffDue = true;
    session.kickoffSerial++;
    assert.equal(session.canReturn('blue-1'), expected === 'return', rulesetId);
    assert.deepEqual(
      session.snapshot().kickoffReturns,
      expected === 'return' ? ['blue-1'] : [],
    );
  }
  // A DAMAGED robot keeps its kick-off exception in both rule sets.
  for (const rulesetId of ['2026', '2027']) {
    const session = continuous(rulesetId);
    session.remove('blue-1', 'Damaged');
    session.bench['blue-1'].ready = true;
    session.kickoffDue = true;
    session.kickoffSerial++;
    assert.equal(session.canReturn('blue-1'), true, rulesetId);
  }
});

test('out of bounds 2027: after the minute the robot waits for an interruption', () => {
  const session = continuous('2027');
  session.remove('blue-1', 'Out of bounds');
  session.match.place({
    ...session.match.state.actors,
    ball: { x: 0.3, z: 0.3, yaw: 0 },
  });
  session.match.state.ballVelocity = { x: 0.05, z: 0.05 };
  advance(session, 61);
  let row = session.snapshot().bench.find((entry) => entry.robot === 'blue-1');
  assert.equal(row.remaining, 0);
  assert.equal(row.eligible, false, 'a served minute alone is not enough');
  assert.equal(row.awaitingInterruption, true);
  assert.equal(session.canReturn('blue-1'), false);
  // An interruption BEFORE the minute ended does not count …
  const early = continuous('2027');
  early.remove('blue-1', 'Out of bounds');
  advance(early, 30);
  early.noteInterruption();
  advance(early, 31);
  assert.equal(early.canReturn('blue-1'), false);
  // … one after it does, and it stays open until the referee acts.
  session.noteInterruption();
  assert.equal(session.canReturn('blue-1'), true);
  advance(session, 5);
  assert.equal(session.canReturn('blue-1'), true);
  row = session.snapshot().bench.find((entry) => entry.robot === 'blue-1');
  assert.equal(row.awaitingInterruption, false);
  // 2026: the minute alone is enough, and the bench row has no such field.
  const previous = continuous('2026');
  previous.remove('blue-1', 'Out of bounds');
  advance(previous, 61);
  assert.equal(previous.canReturn('blue-1'), true);
  assert.equal(
    'awaitingInterruption' in previous.snapshot().bench[0],
    false,
    '2026 snapshots keep their original shape',
  );
});

test('every interruption the trainer counts reopens the return', () => {
  for (const action of ['pushing', 'lack-progress', 'pause', 'neutral']) {
    const session = continuous('2027');
    session.remove('blue-1', 'Out of bounds');
    advance(session, 61);
    assert.equal(session.canReturn('blue-1'), false, action);
    session.active = {
      definition: findRefereeCase('pushing'),
      variant: plain,
      step: 0,
    };
    session.apply({ action });
    assert.equal(session.canReturn('blue-1'), true, action);
  }
  // Removing or relocating a robot alone is not an interruption.
  for (const [action, target] of [
    ['out', 'yellow-1'],
    ['damaged', 'yellow-1'],
    ['multiple', 'blue-2'],
  ]) {
    const session = continuous('2027');
    session.remove('blue-1', 'Out of bounds');
    advance(session, 61);
    session.active = {
      definition: findRefereeCase('multiple'),
      variant: plain,
      step: 0,
    };
    session.apply({ action, target });
    assert.equal(session.canReturn('blue-1'), false, action);
  }
});

test('return placement: own corner for out-of-bounds robots in 2027, neutral spot otherwise', () => {
  const place = (rulesetId, reason) => {
    const session = continuous(rulesetId);
    session.match.place({
      ...session.match.state.actors,
      ball: { x: 0.3, z: 0.4, yaw: 0 },
    });
    session.remove('blue-1', reason);
    session.bench['blue-1'].ready = true;
    session.bench['blue-1'].eligibleAt = session.clock;
    session.noteInterruption();
    session.active = {
      definition: findRefereeCase('return-ready'),
      variant: plain,
      step: 0,
    };
    const effect = session.apply({ action: 'return', target: 'blue-1' });
    return { session, pose: session.match.state.actors['blue-1'], effect };
  };
  const corner = place('2027', 'Out of bounds');
  const ownEnd = -corner.session.match.attackDirection('blue');
  assert.ok(
    ownCornerSpots(ownEnd).some((spot) => distance(spot, corner.pose) < 1e-9),
    'placed on an own-half corner spot',
  );
  // Of the two free corners, the one farther from the ball.
  assert.equal(Math.sign(corner.pose.x), -1);
  assert.match(corner.effect, /own corner/);
  assert.equal(corner.session.bench['blue-1'], undefined);
  for (const [rulesetId, reason] of [
    ['2026', 'Out of bounds'],
    ['2026', 'Damaged'],
    ['2027', 'Damaged'],
  ]) {
    const { pose, effect } = place(rulesetId, reason);
    assert.ok(
      NEUTRAL_SPOTS.some((spot) => distance(spot, pose) < 1e-9),
      `${rulesetId} ${reason}: neutral spot`,
    );
    assert.match(effect, /facing its own goal/);
  }
  // Both corners occupied: the robot waits instead of being placed elsewhere.
  const blocked = continuous('2027');
  blocked.remove('blue-1', 'Out of bounds');
  blocked.bench['blue-1'].eligibleAt = blocked.clock;
  blocked.noteInterruption();
  const [left, right] = ownCornerSpots(-blocked.match.attackDirection('blue'));
  blocked.match.state.actors['yellow-1'] = { ...left };
  blocked.match.state.actors['yellow-2'] = { ...right };
  assert.equal(blocked.canReturn('blue-1'), false);
  // ...and comes back as soon as one of them is free again, never deadlocked.
  blocked.match.state.actors['yellow-1'] = { x: 0, z: 0, yaw: 0 };
  assert.equal(blocked.canReturn('blue-1'), true);
  blocked.active = {
    definition: findRefereeCase('return-ready'),
    variant: plain,
    step: 0,
  };
  blocked.apply({ action: 'return', target: 'blue-1' });
  assert.equal(blocked.bench['blue-1'], undefined);
  assert.ok(
    distance(blocked.match.state.actors['blue-1'], left) < 1e-9,
    'placed on the corner that is free again',
  );
});

test('multiple defense: attackers in the opponent’s area infringe in 2026 only', () => {
  for (const blueAttackDirection of [1, -1]) {
    const yellowAttacks = -blueAttackDirection; // end of the goal Blue defends
    const stage = (rulesetId, team) => {
      const session = continuous(rulesetId);
      session.match.blueAttackDirection = blueAttackDirection;
      const z = yellowAttacks * 0.76;
      session.match.place({
        [`${team}-1`]: { x: -0.2, z, yaw: 0 },
        [`${team}-2`]: { x: 0.25, z, yaw: 0 },
        [`${team === 'blue' ? 'yellow' : 'blue'}-1`]: { x: 0.6, z: 0, yaw: 0 },
        ball: { x: 0, z: 0, yaw: 0 },
      });
      return session.contactDefinition()?.id ?? null;
    };
    assert.equal(stage('2026', 'yellow'), 'live-multiple');
    assert.equal(stage('2027', 'yellow'), null, 'attackers are left alone');
    assert.equal(stage('2026', 'blue'), 'live-multiple');
    assert.equal(
      stage('2027', 'blue'),
      'live-multiple',
      'own area still counts',
    );
  }
});

test('pushing: discretionary contact in 2026, the pushing line in 2027', () => {
  const depth = gameplayRulesFor('2027').pushing.lineDepth;
  const line = pushingLineZ(depth);
  const stage = (rulesetId, defenderZ, { ball = true, gap = 0.244 } = {}) => {
    const session = continuous(rulesetId);
    // Blue attacks +z, so Blue defends the goal at -z.
    session.match.place({
      'blue-1': { x: 0, z: -defenderZ, yaw: 0 },
      'yellow-1': { x: 0, z: -defenderZ + gap, yaw: Math.PI },
      'blue-2': { x: 0.6, z: 0.3, yaw: 0 },
      'yellow-2': { x: -0.6, z: 0.3, yaw: 0 },
      ball: ball
        ? { x: 0, z: -defenderZ + gap / 2, yaw: 0 }
        : { x: 0.5, z: 0.6, yaw: 0 },
    });
    return session.contactDefinition();
  };
  // Robot-ball-robot contact, defender short of the line.
  assert.equal(stage('2027', line - 0.085 - 0.025), null);
  // Same contact with the defender's body on the line: a mandatory call.
  const called = stage('2027', line - 0.085 + 0.03);
  assert.equal(called.id, 'live-pushing');
  assert.deepEqual(called.steps, [[{ action: 'pushing' }]]);
  assert.equal(called.title, 'Contact at the pushing line');
  // Direct robot-to-robot contact counts without the ball.
  assert.equal(
    stage('2027', line - 0.085 + 0.03, { ball: false, gap: 0.2 }).id,
    'live-pushing',
  );
  // No contact at all: reaching the line alone is nothing.
  assert.equal(
    stage('2027', line - 0.085 + 0.03, { ball: false, gap: 0.4 }),
    null,
  );
  // An ATTACKER at the opponent's line is not "the defender".
  const attacker = continuous('2027');
  attacker.match.place({
    'yellow-1': { x: 0, z: -(line - 0.085 + 0.03), yaw: 0 },
    'blue-1': { x: 0, z: -(line - 0.085 + 0.03) + 0.2, yaw: Math.PI },
    ball: { x: 0.5, z: 0.6, yaw: 0 },
  });
  assert.equal(attacker.contactDefinition(), null);
  // 2026 keeps the discretionary pair for the same scenes.
  const old = stage('2026', line - 0.085 - 0.025, { gap: 0.2 });
  assert.equal(old.id, 'live-pushing');
  assert.ok(old.steps[0].every((call) => call.discretionary));
});

test('a settled pushing contact is not called again until it separates', () => {
  const depth = gameplayRulesFor('2027').pushing.lineDepth;
  const z = -(pushingLineZ(depth) - 0.085 + 0.03);
  const session = new RefereeMatch(9, { rulesetId: '2027' });
  session.match.place({
    'blue-1': { x: 0, z, yaw: 0 },
    'yellow-1': { x: 0, z: z + 0.2, yaw: Math.PI },
    ball: { x: 0, z: z + 0.3, yaw: 0 },
  });
  assert.equal(session.contactDefinition().id, 'live-pushing');
  session.active = {
    definition: session.contactDefinition(),
    variant: plain,
    step: 0,
  };
  session.apply({ action: 'pushing' });
  // The ball is gone but the robots still press: no second incident.
  assert.equal(session.contactDefinition(), null);
  session.match.state.actors['yellow-1'] = { x: 0.5, z: 0, yaw: 0 };
  assert.equal(session.contactDefinition(), null);
  session.match.state.actors['yellow-1'] = { x: 0, z: z + 0.2, yaw: Math.PI };
  assert.equal(session.contactDefinition().id, 'live-pushing', 'a new contact');
});

test('holding: inspection in 2026, removal as damaged in 2027', () => {
  const old = drill('2026', 'holding');
  assert.match(submit(old, 'holding', 'blue-1').effect, /mechanism inspection/);
  assert.ok(
    old.match.state.actors['blue-1'],
    '2026 leaves the robot on the field',
  );

  for (const action of ['holding', 'damaged']) {
    const session = drill('2027', 'holding-2027');
    const feedback = submit(session, action, 'blue-1');
    assert.equal(feedback.verdict, 'correct', action);
    assert.equal(session.match.state.actors['blue-1'], undefined);
    assert.equal(session.bench['blue-1'].reason, 'Holding');
    assert.equal(session.bench['blue-1'].ready, false, 're-inspection pending');
    assert.match(feedback.effect, /inspection sticker/);
    assert.deepEqual(
      feedback.appliedRules.map((rule) => rule.id),
      ['holding', 'damage', 'compliance'],
    );
  }
  // 2026 does not treat a plain "damaged" call as the holding call.
  assert.equal(
    submit(drill('2026', 'holding'), 'damaged', 'blue-1').verdict,
    'incorrect',
  );
});

test('lack of progress 2027: a waiting robot returns before the ball moves', () => {
  const session = drill('2027', 'progress-return-first-2027');
  assert.deepEqual(session.acceptedCalls(), [{ action: 'count' }]);
  assert.equal(submit(session, 'count').verdict, 'correct');
  session.continue();
  const ball = { ...session.match.state.actors.ball };
  for (let i = 0; i < 1200 && session.snapshot().count !== null; i++)
    session.step();
  // The count is complete; the ball has not been touched.
  assert.deepEqual(session.acceptedCalls(), [
    { action: 'return', target: 'blue-2' },
  ]);
  assert.match(session.snapshot().help.clue, /bench/);
  const wrong = submit(session, 'lack-progress');
  assert.equal(wrong.verdict, 'incorrect');
  assert.deepEqual(session.match.state.actors.ball, ball, 'ball not moved');
  session.continue();
  const returned = submit(session, 'return', 'blue-2');
  assert.equal(returned.verdict, 'correct');
  assert.ok(session.match.state.actors['blue-2']);
  assert.match(returned.effect, /own corner/);
  assert.deepEqual(
    session.match.state.actors.ball,
    ball,
    'ball still not moved',
  );
  session.continue();
  assert.deepEqual(
    session.acceptedCalls(),
    [{ action: 'lack-progress' }],
    'returning the robot preserves the completed count',
  );
  assert.equal(submit(session, 'lack-progress').verdict, 'correct');
  assert.ok(distance(session.match.state.actors.ball, ball) > 0.01);
  // With nobody waiting, 2027 moves the ball exactly as before.
  const empty = drill('2027', 'deadlock');
  submit(empty, 'count');
  empty.continue();
  for (let i = 0; i < 1200 && empty.snapshot().count !== null; i++)
    empty.step();
  assert.deepEqual(empty.acceptedCalls(), [{ action: 'lack-progress' }]);
  // A robot that is still serving its minute does not change that either.
  const serving = new RefereeMatch(2026, { rulesetId: '2027' });
  serving.beginCase({
    ...bankCase('2027', 'progress-return-first-2027'),
    bench: [
      { robot: 'blue-2', waited: 20, ready: true, reason: 'Out of bounds' },
    ],
  });
  for (let i = 0; i < 2400 && serving.phase === 'evidence'; i++) serving.step();
  submit(serving, 'count');
  serving.continue();
  for (let i = 0; i < 1200 && serving.snapshot().count !== null; i++)
    serving.step();
  assert.deepEqual(serving.acceptedCalls(), [{ action: 'lack-progress' }]);
});

test('continuous 2027 returns every eligible robot without losing the completed count', () => {
  const session = continuous('2027');
  session.match.place({
    ball: { x: 0, z: 0, yaw: 0 },
    'blue-1': { x: -0.5, z: 0, yaw: 0 },
    'yellow-1': { x: 0.5, z: 0, yaw: 0 },
    'blue-2': { x: -0.4, z: 0.4, yaw: 0 },
    'yellow-2': { x: 0.4, z: -0.4, yaw: 0 },
  });
  // Stage genuine immobility without changing the referee's count or incidents.
  const physicsStep = session.match.step.bind(session.match);
  session.match.step = (options) =>
    physicsStep({
      ...options,
      controls: { blue: 'off', yellow: 'off' },
    });
  for (const id of ['blue-2', 'yellow-2']) {
    session.remove(id, 'Out of bounds');
    session.bench[id].eligibleAt = session.clock - 1;
  }
  advance(session, 1.2);
  assert.equal(submit(session, 'count').verdict, 'correct');
  advance(session, 3.1);
  const ball = { ...session.match.state.actors.ball };
  assert.equal(session.snapshot().count, null);
  for (const id of ['yellow-2', 'blue-2']) {
    assert.ok(
      session
        .acceptedCalls()
        .some((call) => call.action === 'return' && call.target === id),
    );
    assert.equal(submit(session, 'return', id).verdict, 'correct');
    assert.deepEqual(session.match.state.actors.ball, ball);
  }
  assert.deepEqual(session.acceptedCalls(), [{ action: 'lack-progress' }]);
  assert.equal(submit(session, 'lack-progress').verdict, 'correct');
  assert.ok(distance(session.match.state.actors.ball, ball) > 0.01);
});

test('all robots out: 2027 calls a neutral kickoff that waits for returning robots', () => {
  const session = continuous('2027');
  for (const robot of MATCH_ROBOTS) session.remove(robot.id, 'Out of bounds');
  advance(session, 0.1);
  assert.equal(session.active.definition.id, 'live-all-out-2027');
  assert.deepEqual(session.acceptedCalls(), [{ action: 'neutral' }]);
  assert.equal(session.active.reactionPersistent, true);
  const feedback = submit(session, 'neutral');
  assert.equal(feedback.verdict, 'correct');
  assert.deepEqual(
    feedback.appliedRules.map((rule) => rule.id),
    ['neutral', 'kickoffReturn'],
  );
  let frame = session.snapshot();
  assert.equal(frame.kickoffDue, true);
  assert.equal(frame.kickoffTeam, 'neutral');
  assert.equal(frame.canArrangeKickoff, false, 'nobody to arrange yet');
  assert.deepEqual(frame.kickoffReturns, [], 'the minute is a minimum');
  // No team "remains", so the 30-second award of rule 2.9 never fires.
  advance(session, 45);
  assert.deepEqual(session.snapshot().score, { blue: 0, yellow: 0 });
  assert.ok(
    ![session.active, ...session.pending].some(
      (item) => item && /both-damaged/.test(item.definition.id),
    ),
  );
  advance(session, 20);
  frame = session.snapshot();
  assert.equal(
    frame.kickoffReturns.length,
    4,
    'minute served at a pending kickoff',
  );
  // 2026: an empty field raises nothing.
  const old = continuous('2026');
  for (const robot of MATCH_ROBOTS) old.remove(robot.id, 'Out of bounds');
  advance(old, 5);
  assert.equal(old.active, null);
  assert.equal(old.snapshot().kickoffDue, false);
});

test('goals while a robot is out of bounds: the team in 2026, the scorer in 2027', () => {
  const stage = (rulesetId, scorer) => {
    const session = continuous(rulesetId);
    const end = session.match.attackDirection('blue');
    session.match.place({
      'blue-1': { x: 0, z: end * 0.4, yaw: 0 },
      'blue-2': { x: 0.5, z: 0, yaw: 0 },
      'yellow-1': { x: -0.6, z: -end * 0.6, yaw: 0 },
      ball: { x: 0, z: end * (FIELD.goalMouthZ - 0.04), yaw: 0 },
    });
    session.outRobots.add('blue-2'); // called out, not yet removed
    session.match.lastBallTouchActor = scorer;
    session.match.state.ballVelocity = { x: 0, z: end * 2 };
    advance(session, 1);
    return session;
  };
  // The fast test shot may re-enter the pocket; the first passage decides.
  const first = (session) =>
    [...session.observations.values()]
      .map((item) => item.definition.id)
      .find((id) => /goal/.test(id));
  assert.equal(first(stage('2026', 'blue-1')), 'live-out-goal');
  assert.equal(first(stage('2026', 'blue-2')), 'live-out-goal');
  assert.equal(first(stage('2027', 'blue-1')), 'live-goal', 'teammate scores');
  assert.equal(first(stage('2027', 'blue-2')), 'live-out-goal');
  const scorer = [...stage('2027', 'blue-2').observations.values()][0];
  assert.match(scorer.definition.facts, /scored this goal itself/);
  assert.deepEqual(
    scorer.definition.steps.map((step) => step.map((call) => call.action)),
    [['no-goal'], ['out']],
  );
});

test('pushed onto the ramp: an optional decision in 2027, nothing in 2026', () => {
  for (const rulesetId of ['2026', '2027']) {
    const session = continuous(rulesetId);
    const edge = clampRobotToField(
      { x: FIELD.floorHalfWidth, z: 0, yaw: -Math.PI / 2 },
      session.robotVisual,
    );
    session.match.place({
      'blue-1': { ...edge, x: edge.x - 0.05 },
      'yellow-1': { x: edge.x - 0.25, z: 0, yaw: Math.PI / 2 },
      ball: { x: -0.5, z: 0.5, yaw: 0 },
    });
    session.match.lastOpponentPushers.set('blue-1', 'yellow-1');
    session.detectLiveIncident();
    if (rulesetId === '2026') {
      assert.equal(session.active, null);
      continue;
    }
    assert.equal(session.active.definition.id, 'live-pushed-ramp-2027');
    assert.ok(session.acceptedCalls().every((call) => call));
    assert.deepEqual(
      session.acceptedCalls().map((call) => call.action),
      ['waive-out', 'play-on'],
    );
    // Optional: ignoring it is never a missed call.
    assert.equal(session.requiredIncident(session.active), false);
    const feedback = submit(session, 'waive-out', 'blue-1');
    assert.equal(feedback.verdict, 'supported');
    assert.equal(
      robotOnRamp(session.match.state.actors['blue-1'], session.robotVisual),
      false,
      'moved off the wedge',
    );
    assert.deepEqual(
      feedback.appliedRules.map((rule) => rule.id),
      ['pushed'],
    );
  }
  // Without an opponent pushing, standing on the wedge is nothing.
  const alone = continuous('2027');
  alone.match.place({
    'blue-1': { x: FIELD.floorHalfWidth - 0.15, z: 0, yaw: 0 },
    ball: { x: 0, z: 0.5, yaw: 0 },
  });
  alone.detectLiveIncident();
  assert.equal(alone.active, null);
});

test('every drill of every rule set is solvable as authored, for every robot model', () => {
  for (const rulesetId of ['2026', '2027'])
    for (const { id: robotVisual } of ROBOT_VISUALS)
      for (const item of learningBank(rulesetId).cases) {
        const label = `${rulesetId}/${robotVisual}/${item.id}`;
        const session = new RefereeMatch(2026, { robotVisual, rulesetId });
        assert.equal(session.beginCase(item, plain), true, label);
        const calls = solve(session, label);
        assert.ok(calls.length >= item.steps.length, label);
        assert.ok(
          new URL(ruleUrl(item, rulesetId)).hash.length > 1,
          `${label} has an official source`,
        );
      }
});

test('2027 drills resolve to the calls the draft prescribes', () => {
  const calls = (id, options) => {
    const session = new RefereeMatch(2026, { rulesetId: '2027', ...options });
    session.beginCase(bankCase('2027', id), plain);
    return solve(session, id);
  };
  assert.deepEqual(calls('pushing-line-2027'), ['pushing']);
  assert.deepEqual(calls('pushing-short-2027'), ['play-on']);
  assert.deepEqual(calls('attackers-area-2027'), ['play-on']);
  assert.deepEqual(calls('combined-2027'), ['pushing', 'multiple:blue-1']);
  assert.deepEqual(calls('holding-2027'), ['holding:blue-1']);
  assert.deepEqual(calls('out-goal-teammate-2027'), [
    'goal:blue',
    'out:blue-2',
  ]);
  assert.deepEqual(calls('out-goal-scorer-2027'), ['no-goal', 'out:blue-1']);
  assert.deepEqual(calls('out-return-kickoff-2027'), ['keep-out:blue-1']);
  assert.deepEqual(calls('out-return-served-2027'), ['return:blue-1']);
  assert.deepEqual(calls('out-return-running-2027'), ['keep-out:blue-1']);
  assert.deepEqual(calls('all-out-2027'), ['neutral']);
  assert.equal(calls('pushed-ramp-2027')[0], 'waive-out:blue-1');
  const progress = calls('progress-return-first-2027');
  assert.deepEqual(progress, ['count', 'return:blue-2', 'lack-progress']);
  // The same return drills under 2026 semantics would be answered differently,
  // which is why they are not part of the 2026 bank.
  assert.equal(bankCase('2026', 'out-return-kickoff-2027'), undefined);
  // The 2026 bank keeps all 35 original drills, untouched.
  assert.equal(learningBank('2026').cases, REFEREE_CASES);
});

test('the authored 2027 pushing scenes sit on the intended side of the line', () => {
  const depth = gameplayRulesFor('2027').pushing.lineDepth;
  for (const { id: visual } of ROBOT_VISUALS) {
    const at = (id) =>
      caseScene(bankCase('2027', id), 999, plain, visual).poses['blue-1'];
    assert.equal(
      robotReachesPushingLine(at('pushing-line-2027'), -1, depth, visual),
      true,
      visual,
    );
    assert.equal(
      robotReachesPushingLine(at('pushing-short-2027'), -1, depth, visual),
      false,
      visual,
    );
    // The defender is pushed back, not fully into its area (that is out of bounds).
    assert.equal(
      robotPenaltyOverlap(at('pushing-line-2027'), -1, visual, true),
      false,
    );
    // Scenes that 2027 keeps or adds for pushing must satisfy the new test.
    for (const id of ['combined-2027', 'pushing-goal'])
      assert.equal(
        robotReachesPushingLine(at(id), -1, depth, visual),
        true,
        `${visual} ${id}`,
      );
    for (const [id, robot] of [
      ['pushing-call', 'blue-1'],
      ['combined-order', 'blue-2'],
    ]) {
      const clip = learningBank('2027').clips.find((item) => item.id === id);
      const defender = sampleClip(clip, 2.5).poses[robot];
      assert.equal(
        robotReachesPushingLine(defender, -1, depth, visual),
        true,
        `${visual} ${id}`,
      );
      assert.equal(
        robotPenaltyOverlap(defender, -1, visual, true),
        false,
        `${visual} ${id} is not fully out`,
      );
    }
  }
  // The 2026 combined scene stops before its defender would reach the line,
  // so 2027 replaces it rather than rewording it.
  assert.equal(bankCase('2027', 'combined'), undefined);
});

test('applied rules name the selected rule set and link into it', () => {
  const session = drill('2027', 'pushing-line-2027');
  const [rule, line] = submit(session, 'pushing').appliedRules;
  assert.equal(rule.document, 'Soccer rules 2027');
  assert.equal(rule.number, '2.6');
  assert.match(
    rule.url,
    /2027-soccer-draft-rules\/rules\.html#inside-penalty-area$/,
  );
  assert.match(rule.lessonUrl, /ruleset=2027/);
  assert.match(rule.note, /provisional/);
  assert.equal(line.id, 'penalty-line');
  assert.match(line.url, /2027-soccer-draft-rules\/field_specification/);
  const old = rulesForDecision(findRefereeCase('multiple'), 'multiple');
  assert.equal(old[0].document, 'Soccer rules 2026');
  assert.equal(old[0].quote, 'at least partially in a penalty area');
  assert.doesNotMatch(old[0].lessonUrl, /ruleset=/);
  assert.match(old[0].url, /soccer-rules\/master\/rules\.html/);
  assert.equal(
    rulesForDecision(findRefereeCase('multiple'), 'multiple', {}, '2027')[0]
      .quote,
    'at least partially in their own penalty area',
  );
});

// A perfect referee that follows the engine's own accepted calls must be able
// to finish 2027 matches in both modes without the driver stalling.
for (const entry of [
  { mode: 'continuous', seed: 2026, policy: 'perfect' },
  { mode: 'continuous', seed: 77, policy: 'sloppy' },
  { mode: 'continuous', seed: 4242, policy: 'idle' },
  { mode: 'step', seed: 11, policy: 'perfect' },
  {
    mode: 'step',
    seed: 31337,
    policy: 'perfect',
    robotVisual: 'xlc-innovation-2021',
  },
])
  test(`2027 matches run to full time: ${entry.mode} seed ${entry.seed} (${entry.policy})`, () => {
    const first = runDeterministicSession({ ...entry, rulesetId: '2027' });
    const second = runDeterministicSession({ ...entry, rulesetId: '2027' });
    assert.equal(first.hash, second.hash, 'deterministic');
    assert.ok(first.calls < 400, `no runaway decision loop (${first.calls})`);
    if (entry.policy === 'perfect') {
      assert.equal(first.report.wrong, 0);
      assert.ok(first.report.accuracy >= 85, JSON.stringify(first.report));
    }
    if (entry.policy === 'idle') assert.equal(first.report.correct, 0);
  });
