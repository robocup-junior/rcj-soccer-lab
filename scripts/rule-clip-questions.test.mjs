import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';
import translations from './clip-question-translations.mjs';

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

const { RULE_CLIPS } = await import('../lib/rulebook/animations.ts');
const { CLIP_ASSESSMENTS } =
  await import('../lib/rulebook/clip-assessments.ts');
const { translateText } = await import('../lib/i18n/index.ts');
const clip = (id) => RULE_CLIPS.find((item) => item.id === id);
const decisionTimes = {
  'match-halves': 3,
  'late-team': 3,
  'toss-ends': 2.5,
  'toss-kickoff': 2.5,
  'kickoff-valid': 4,
  'kickoff-early': 2,
  'neutral-start': 3,
  'neutral-correction': 0,
  'goal-contact': 4,
  'goal-near-miss': 5,
  'own-goal': 3,
  'dribble-access': 6,
  'trapped-ball': 4,
  'ball-over-wall': 3.5,
  'neutral-response': 5,
  'pushing-call': 2.5,
  'contact-midfield': 3,
  'two-defenders': 2.5,
  'combined-order': 2.5,
  'pushing-goal': 3,
  deadlock: 4,
  'deadlock-repeat': 4,
  'wall-touch': 2,
  'full-area': 3,
  'pushed-out': 2.5,
  'repair-clock': 3.5,
  'repair-kickoff': 3,
  'both-damaged': 0,
  'team-touch': 0,
  'referee-unstick': 3,
  'pause-resume': 2,
  'pause-neutral': 0,
};

test('question rewrite preserves every clip ID, answer index, source anchor, frame time and geometry', () => {
  // Baseline taken before the wording rewrite. Captions are deliberately excluded;
  // these values underpin already-saved numeric answers and authored match evidence.
  const evidence = RULE_CLIPS.map(
    ({ id, anchor, alsoAnchors, answer, frames }) => ({
      id,
      anchor,
      alsoAnchors,
      answer,
      frames: frames.map(({ at, poses, heights, focus }) => ({
        at,
        poses,
        heights,
        focus,
      })),
    }),
  );
  assert.equal(
    createHash('sha256').update(JSON.stringify(evidence)).digest('hex'),
    '57e3ba42ab8c60d2f04250739b87f831c3dc0eb54acd41a68aad821ea0305038',
  );
});

test('every clip has an evidence-keyframe cutoff and enough caption-free context', () => {
  assert.deepEqual(
    Object.keys(CLIP_ASSESSMENTS).sort(),
    RULE_CLIPS.map(({ id }) => id).sort(),
  );
  for (const item of RULE_CLIPS) {
    const assessment = CLIP_ASSESSMENTS[item.id];
    assert.equal(assessment.decisionAt, decisionTimes[item.id], item.id);
    assert.ok(
      item.frames.some(({ at }) => at === assessment.decisionAt),
      item.id,
    );
    assert.ok(assessment.decisionAt <= item.frames.at(-1).at, item.id);
    assert.ok(assessment.context.length >= 40, item.id);
  }
  // The following frame already interpolates a correction: do not wait for its
  // endpoint, or the learner sees the answer before choosing it.
  for (const id of ['two-defenders', 'combined-order', 'pushing-call'])
    assert.equal(CLIP_ASSESSMENTS[id].decisionAt, 2.5, id);
  assert.equal(CLIP_ASSESSMENTS['both-damaged'].decisionAt, 0);
  assert.equal(CLIP_ASSESSMENTS['neutral-correction'].decisionAt, 0);
});

test('questions ask explicit decisions and alternatives are more than bare yes/no or team names', () => {
  for (const item of RULE_CLIPS) {
    assert.ok(item.question.endsWith('?'), item.id);
    assert.ok(item.options.length >= 2, item.id);
    assert.ok(item.answer >= 0 && item.answer < item.options.length, item.id);
    assert.equal(new Set(item.options).size, item.options.length, item.id);
    for (const option of item.options)
      assert.doesNotMatch(
        option,
        /^(?:yes|no|always|never|blue|yellow)$/i,
        item.id,
      );
    assert.doesNotMatch(
      item.question,
      /receives the goal|useful evidence|attacking end|what does the demonstration show/i,
      item.id,
    );
    assert.ok(item.feedback.length >= 70, item.id);
  }
});

test('goal, access, causal pushing and discretionary exceptions remain explicit', () => {
  assert.match(clip('own-goal').question, /score.*one goal/);
  assert.match(clip('own-goal').options[1], /Yellow.*Yellow's score/);
  assert.match(clip('dribble-access').question, /call ball holding/);
  assert.match(clip('dribble-access').feedback, /backspin.*opponents.*access/);
  assert.match(clip('pushing-goal').question, /resulted from pushing/);
  assert.match(clip('pushing-goal').feedback, /caused by.*not granted/);
  assert.match(clip('late-team').feedback, /discretionary, not automatic/);
  assert.match(
    clip('both-damaged').feedback,
    /either robot.*opponent violated/,
  );
  assert.match(clip('combined-order').feedback, /pushing first.*new position/);
  assert.match(clip('deadlock').feedback, /not a universal three-second/);
});

test('all rewritten questions, choices, explanations, cues and captions have reviewed sk/de/ja translations', () => {
  const changedCaptions = [
    'Choose which goal to attack',
    'Blue chooses the blue-painted goal to attack',
    'Blue attacks the blue-painted goal',
    'Yellow takes the first kickoff',
    'Yellow chooses the blue-painted goal to attack',
    'Yellow attacks the blue-painted goal',
    'Shot toward the goal defended by Yellow',
    'Blue defends the blue-painted goal',
    'Ball touches the back wall of the goal Blue defends',
    'A goal caused by pushing',
    'Pushing sends the ball to the goal back wall',
    '30 s · YELLOW +1 · opponent-violation exception excluded',
    'No award if an opponent rule violation caused the damage',
  ];
  const sourceStrings = new Set([
    ...RULE_CLIPS.flatMap((item) => [
      item.question,
      ...item.options,
      item.feedback,
      CLIP_ASSESSMENTS[item.id].context,
    ]),
    ...changedCaptions,
  ]);
  for (const locale of ['sk', 'de', 'ja']) {
    assert.deepEqual(
      Object.keys(translations[locale]).sort(),
      [...sourceStrings].sort(),
      locale,
    );
    for (const source of sourceStrings) {
      assert.equal(
        typeof translations[locale][source],
        'string',
        `${locale}: ${source}`,
      );
      assert.ok(
        translations[locale][source].trim().length > 0,
        `${locale}: ${source}`,
      );
      assert.notEqual(
        translations[locale][source],
        source,
        `${locale}: ${source}`,
      );
    }
  }
});

test('the shipped runtime translates every reviewed clip question, choice, explanation, cue and caption', () => {
  for (const [locale, dictionary] of Object.entries(translations))
    for (const [source, reviewed] of Object.entries(dictionary))
      assert.equal(
        translateText(source, locale),
        reviewed,
        `${locale}: ${source}`,
      );
});
