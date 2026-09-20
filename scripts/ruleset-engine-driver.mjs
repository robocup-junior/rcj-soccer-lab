import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { RefereeMatch } from '../lib/simulator/referee-match.ts';
import { TRAINING_TOPICS } from '../lib/simulator/referee-training.ts';

const ALL_TOPICS = TRAINING_TOPICS.map((topic) => topic.id);
const round = (value) => Math.round(value * 1e6) / 1e6;

function sample(session) {
  const frame = session.snapshot();
  return {
    tick: session.trainingTick,
    phase: frame.phase,
    score: frame.score,
    actors: Object.fromEntries(
      Object.entries(frame.actors)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, pose]) => [
          id,
          [round(pose.x), round(pose.z), round(pose.yaw)],
        ]),
    ),
    bench: frame.bench
      .map((entry) => [
        entry.robot,
        entry.reason,
        round(entry.remaining),
        entry.ready,
        entry.eligible,
      ])
      .sort(),
    kickoffDue: frame.kickoffDue,
    kickoffTeam: frame.kickoffTeam,
    pending: frame.pendingDecisions,
    title: session.active?.definition?.id ?? null,
  };
}

/**
 * Deterministic referee policies used to pin engine behaviour:
 * - perfect: always submits the engine's first accepted call;
 * - sloppy: every third decision is a deliberately wrong removal;
 * - idle: only performs the actions needed to keep a match running.
 */
export function runDeterministicSession({
  mode,
  seed,
  policy = 'perfect',
  rulesetId,
  duration = 240,
  robotVisual = 'lab',
}) {
  const session = new RefereeMatch(seed, {
    preMatch: true,
    robotVisual,
    mode,
    duration,
    topics: ALL_TOPICS,
    recordMatchReplay: false,
    ...(rulesetId ? { rulesetId } : {}),
  });
  const digest = createHash('sha256');
  const trace = [];
  let decisions = 0;
  const call = (choice) => {
    decisions += 1;
    const wrong = policy === 'sloppy' && decisions % 3 === 0;
    const submitted = wrong
      ? { action: 'out', target: 'yellow-2' }
      : {
          action: choice.action,
          ...(choice.target ? { target: choice.target } : {}),
        };
    const key = session.decisionKey;
    const applied = session.submit(key, submitted);
    trace.push([
      session.trainingTick,
      submitted.action,
      submitted.target ?? '',
      applied,
      session.snapshot().feedback?.verdict ?? null,
    ]);
    return applied;
  };

  assert.equal(session.tossCoin(), true);
  assert.equal(session.chooseOpeningEnd(seed % 2 ? 'yellow' : 'blue'), true);
  call({ action: 'start' });

  let guard = 0;
  while (!session.snapshot().sessionFinished) {
    guard += 1;
    assert.ok(
      guard < 400_000,
      `driver stalled (${mode}/${policy}/${rulesetId ?? 'default'}) at tick ${session.trainingTick}: ${JSON.stringify(sample(session))}`,
    );
    const frame = session.snapshot();
    if (session.trainingTick % 600 === 0)
      digest.update(JSON.stringify(sample(session)));

    if (frame.kickoffReturns.length) {
      call({ action: 'return', target: frame.kickoffReturns[0] });
      continue;
    }
    if (frame.canArrangeKickoff) {
      assert.equal(session.arrangeKickoff(), true);
      // After a wrong call during a pending kickoff the arranged-kickoff
      // observation may already exist; signal the start like a user would.
      if (!session.active || !session.acceptedCalls().length)
        call({ action: 'start' });
      continue;
    }
    if (mode === 'step') {
      if (frame.phase === 'feedback') {
        session.continue();
        continue;
      }
      if (frame.canStartCase) {
        assert.equal(session.nextCase(), true);
        continue;
      }
      if (frame.phase === 'decision' && frame.help?.choices?.length) {
        call(frame.help.choices[0]);
        continue;
      }
    } else if (
      frame.count === null &&
      session.active &&
      session.acceptedCalls().length &&
      (policy !== 'idle' ||
        frame.kickoffDue ||
        session
          .acceptedCalls()
          .some((entry) => ['start', 'neutral'].includes(entry.action)))
    ) {
      call(session.acceptedCalls()[0]);
      continue;
    }
    if (!session.canAdvance) {
      if (session.canResumeMotion) {
        session.resumeMotion();
        continue;
      }
      assert.fail(
        `driver stopped (${mode}/${policy}/${rulesetId ?? 'default'}) at tick ${session.trainingTick}: ${JSON.stringify(sample(session))}`,
      );
    }
    session.step();
  }
  const frame = session.snapshot();
  const report = {
    correct: frame.report.correct,
    wrong: frame.report.wrong,
    missed: frame.report.missed,
    assisted: frame.report.assisted,
    assessed: frame.report.assessed,
    accuracy: frame.report.accuracy,
  };
  digest.update(JSON.stringify(sample(session)));
  digest.update(JSON.stringify(report));
  digest.update(JSON.stringify(trace));
  digest.update(
    JSON.stringify(
      frame.review.map((entry) => [
        round(entry.at),
        entry.situation,
        entry.assessment,
        entry.actual,
        entry.expected,
        entry.scored,
      ]),
    ),
  );
  return {
    hash: digest.digest('hex'),
    report,
    calls: trace.length,
    score: frame.score,
    trace,
    review: frame.review,
  };
}

export const GOLDEN_MATRIX = [
  { mode: 'continuous', seed: 11, policy: 'perfect' },
  { mode: 'continuous', seed: 2026, policy: 'perfect' },
  { mode: 'continuous', seed: 77, policy: 'sloppy' },
  { mode: 'continuous', seed: 4242, policy: 'idle' },
  {
    mode: 'continuous',
    seed: 90210,
    policy: 'perfect',
    robotVisual: 'xlc-open-2020',
  },
  { mode: 'step', seed: 11, policy: 'perfect' },
  { mode: 'step', seed: 2026, policy: 'sloppy' },
  {
    mode: 'step',
    seed: 31337,
    policy: 'perfect',
    robotVisual: 'xlc-innovation-2021',
  },
];
