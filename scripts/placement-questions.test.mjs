import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { registerTrustedTypes } from './github-academy.mjs';
import placementTranslations from './placement-question-translations.mjs';
import lessonUiTranslations from './lesson-ui-translations.mjs';
registerTrustedTypes();
const { RULE_QUESTIONS } = await import('../lib/rulebook/questions.ts');
const { SCENARIOS } = await import('../lib/simulator/scenarios.ts');
const { translateText } = await import('../lib/i18n/index.ts');

const legacyAnswers = [
  ['vision-dimensions', 1],
  ['infrared-dimensions', 0],
  ['capture-depth-access', 2],
  ['handle-exception', 0],
  ['top-marker-exception', 1],
  ['electrical-safety', 2],
  ['lithium-safety', 0],
  ['mechanical-stop-safety', 1],
  ['radio-limits', 2],
  ['colours-lights', 1],
  ['infrared-emitters', 0],
  ['autonomy-agility', 2],
  ['communication-module', 1],
  ['inspection-cadence', 0],
  ['kicker-test-setup', 2],
  ['kicker-test-result', 1],
  ['kicker-recheck', 0],
  ['repeated-out-damage', 2],
  ['removed-motors', 1],
  ['neutral-capability', 0],
  ['neutral-obstruction', 2],
  ['ball-above-wall', 1],
  ['lack-progress-placement', 0],
  ['return-placement', 2],
  ['final-score-trim', 1],
  ['full-match-duration', 0],
  ['result-disputes', 2],
  ['interference-evidence', 1],
  ['specification-violation', 0],
  ['pushed-out-policy', 2],
  ['infrared-ball-change', 1],
  ['event-scope', 0],
];
const additions = [
  ['lack-progress-nearest-free', 2],
  ['pushing-ball-furthest-free', 0],
  ['multiple-defense-robot-spot', 2],
  ['damaged-return-occupied-spot', 1],
  ['lack-progress-repeat-spot', 1],
  ['ball-out-followup-placement', 1],
];
const question = (id) => {
  const value = RULE_QUESTIONS.find((item) => item.id === id);
  assert.ok(value, id);
  return value;
};
const selected = (id) => {
  const item = question(id);
  return item.options[item.answer];
};
const scenario = (id) => SCENARIOS.find((item) => item.id === id);

test('six placement questions are additive; all existing question IDs and answer indices remain stable', () => {
  assert.equal(
    new Set(RULE_QUESTIONS.map((item) => item.id)).size,
    RULE_QUESTIONS.length,
  );
  assert.deepEqual(
    RULE_QUESTIONS.map(({ id, answer }) => [id, answer]),
    [...legacyAnswers, ...additions],
  );
  for (const [id] of additions) {
    const item = question(id);
    assert.match(item.question, /\?$/);
    assert.equal(item.options.length, 3);
    assert.ok(item.feedback.length > 50);
    assert.ok(
      [
        'lack-of-progress',
        'inside-penalty-area',
        'damaged-robots',
        'ball-movement',
      ].includes(item.anchor),
    );
  }
});

test('ball placement distinguishes nearest lack-of-progress from furthest pushing and skips occupied spots', () => {
  assert.equal(
    selected('lack-progress-nearest-free'),
    'To B, the nearest unoccupied spot',
  );
  assert.match(
    question('lack-progress-nearest-free').question,
    /A is 20 cm.*occupied; B is free at 45 cm; C is free at 90 cm/,
  );
  assert.equal(
    selected('pushing-ball-furthest-free'),
    'The ball, to the furthest unoccupied neutral spot',
  );
  assert.match(
    question('pushing-ball-furthest-free').feedback,
    /Skip occupied spots/,
  );
});

test('multiple defense moves the farther robot, while a permitted robot return also requires its own-goal orientation', () => {
  assert.equal(
    selected('multiple-defense-robot-spot'),
    'Move Blue 2 to the furthest unoccupied neutral spot',
  );
  assert.match(
    question('multiple-defense-robot-spot').feedback,
    /ball is not relocated/,
  );
  assert.equal(
    selected('damaged-return-occupied-spot'),
    'At the free spot 100 cm from the ball, facing its own goal',
  );
  assert.match(
    question('damaged-return-occupied-spot').question,
    /eligible and has permission/,
  );
  assert.match(
    question('damaged-return-occupied-spot').question,
    /furthest from the ball is occupied/,
  );
});

test('repeat placement and ball-out questions state the extra call instead of inventing an automatic nearest-spot rule', () => {
  assert.match(
    selected('lack-progress-repeat-spot'),
    /Count and call lack of progress again.*different unoccupied/,
  );
  assert.equal(
    selected('ball-out-followup-placement'),
    'The ball; the robot stays off until it may return with permission',
  );
  assert.match(
    question('ball-out-followup-placement').question,
    /after a completed count, the referee calls lack of progress/,
  );
  assert.match(
    question('ball-out-followup-placement').feedback,
    /does not itself specify a replacement spot/,
  );
  assert.match(
    question('ball-out-followup-placement').feedback,
    /Rule 2\.7.*Rule 2\.9/,
  );
});

test('all six detailed studies ask a direct question without changing accepted choices or grades', () => {
  assert.equal(SCENARIOS.length, 6);
  for (const item of SCENARIOS) assert.match(item.refereeCue, /\?$/, item.id);
  assert.deepEqual(
    SCENARIOS.map((item) => [
      item.id,
      item.choices.map(({ id, grade, score }) => [id, grade, score]),
    ]),
    [
      [
        'legal-dribbler-backspin',
        [
          ['play-on', 'correct', 1],
          ['call-holding', 'incorrect', 0],
          ['warn-team', 'partial', 0.35],
          ['disable-roller', 'incorrect', 0],
        ],
      ],
      [
        'illegal-ball-holding',
        [
          ['call-holding', 'correct', 1],
          ['brief-observation', 'acceptable', 0.85],
          ['play-on', 'incorrect', 0],
          ['invent-restart', 'partial', 0.25],
        ],
      ],
      [
        'multiple-defense-basic',
        [
          ['move-farther', 'correct', 1],
          ['move-nearer', 'incorrect', 0],
          ['wait-for-ball', 'incorrect', 0.1],
          ['move-both', 'incorrect', 0],
        ],
      ],
      [
        'pushing-discretion',
        [
          ['call-pushing', 'correct', 1],
          ['play-on', 'acceptable', 1],
          ['automatic-contact-call', 'incorrect', 0],
          ['guess-from-color', 'incorrect', 0],
        ],
      ],
      [
        'pushing-and-multiple-defense',
        [
          ['pushing-first', 'correct', 1],
          ['defense-first', 'partial', 0.45],
          ['call-both', 'partial', 0.3],
          ['ignore-both', 'incorrect', 0],
        ],
      ],
      [
        'goal-back-wall',
        [
          ['wait-back-wall', 'correct', 1],
          ['plane-crossing', 'incorrect', 0],
          ['wait-rest', 'partial', 0.35],
          ['no-goal-rebound', 'incorrect', 0],
        ],
      ],
    ],
  );
  const multiple = scenario('multiple-defense-basic');
  assert.match(multiple.refereeCue, /Which robot should you move, and where\?/);
  for (const id of ['move-farther', 'move-nearer'])
    assert.match(
      multiple.choices.find((item) => item.id === id).label,
      /Blue [12] to the furthest unoccupied neutral spot/,
    );
  assert.match(
    multiple.choices.find((item) => item.id === 'move-nearer').feedback,
    /Blue 1 is nearer.*Move Blue 2/,
  );
});

test('coin toss asks which goal to attack in plain language', () => {
  const source = readFileSync(
    new URL('../components/simulator/PreMatchToss.tsx', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(source, /attacking end|chooses an end/);
  assert.match(
    source,
    /Which goal will \$\{name\(meeting.choosingTeam\)\} attack\?/,
  );
  assert.match(source, /first kickoff or which goal to attack/);
});

const goalAwardHint =
  'Watch for contact with the INSIDE back wall, not just the post or goal line. The team attacking that end is awarded one point, regardless of the last touch.';

test('live goal teaching text awards a point without ambiguous goal-receiving wording', () => {
  const engine = readFileSync(
    new URL('../lib/simulator/referee-match.ts', import.meta.url),
    'utf8',
  );
  assert.ok(engine.includes(goalAwardHint));
  for (const directory of ['lib', 'components']) {
    const base = new URL(`../${directory}/`, import.meta.url);
    for (const name of readdirSync(base, { recursive: true })) {
      if (!/\.tsx?$/.test(name)) continue;
      assert.doesNotMatch(
        readFileSync(new URL(name.replaceAll('\\', '/'), base), 'utf8'),
        /receives the goal/i,
        `${directory}/${name}`,
      );
    }
  }
});

function changedSources() {
  const multiple = scenario('multiple-defense-basic');
  const combined = scenario('pushing-and-multiple-defense').choices.find(
    (item) => item.id === 'defense-first',
  );
  return new Set([
    goalAwardHint,
    ...additions.flatMap(([id]) => {
      const item = question(id);
      return [item.title, item.question, ...item.options, item.feedback];
    }),
    ...SCENARIOS.map((item) => item.refereeCue),
    ...multiple.choices.map((item) => item.feedback),
    ...multiple.choices
      .filter((item) => ['move-farther', 'move-nearer'].includes(item.id))
      .map((item) => item.label),
    combined.label,
    combined.feedback,
    'Which goal will {0} attack?',
    'The coin-toss winner chooses either the first kickoff or which goal to attack. The other team makes the remaining choice.',
  ]);
}

test('reviewed placement translations cover every new or changed question, choice, feedback and toss string', () => {
  const sources = changedSources();
  for (const locale of ['sk', 'de', 'ja']) {
    assert.deepEqual(
      new Set(Object.keys(placementTranslations[locale])),
      sources,
      locale,
    );
    for (const source of sources) {
      const translated = placementTranslations[locale][source];
      assert.equal(typeof translated, 'string', `${locale}: ${source}`);
      assert.ok(translated.trim());
      assert.notEqual(translated, source);
      assert.doesNotMatch(translated, /\uFFFD/);
      const markers = (value) =>
        value.match(/Blue [12]|Yellow [12]|\b\d+(?:\.\d+)?\b/g) ?? [];
      assert.deepEqual(
        markers(translated).sort(),
        markers(source).sort(),
        `${locale}: numbers and robot IDs in ${source}`,
      );
    }
  }
});

test('generated placement translations match every reviewed entry and both coin-toss team names', () => {
  for (const locale of ['sk', 'de', 'ja'])
    for (const [source, translated] of Object.entries(
      placementTranslations[locale],
    )) {
      if (source.includes('{0}')) {
        for (const team of ['Blue', 'Yellow'])
          assert.equal(
            translateText(source.replace('{0}', team), locale),
            translated.replace('{0}', translateText(team, locale)),
          );
      } else
        assert.equal(
          translateText(source, locale),
          translated,
          `${locale}: ${source}`,
        );
    }
});

const lessonUiSources = [
  'Acceptable referee decision',
  'Incorrect answer',
  'Watch explained replay',
  'Guided practice: the explanation is visible. This is not an unaided answer.',
  'Observe the robots and ball.',
  'Use the setup described above to make your decision.',
  'Watch up to the decision point. The explanation appears after your answer.',
  'Your answer is already recorded for this certification round. Reviewing the explanation will not change it.',
  'Your first answer is recorded. Reviewing the explanation will not change your score.',
  'You can try again for practice.',
  'Questions answered',
  'Answer recorded',
  'questions answered',
  'All questions answered',
  'Select a certification question from the list.',
  'Question {0}',
];

test('reviewed lesson UI translations cover the current feedback, guidance and recorded-answer labels', () => {
  const source = [
    'AnswerFeedback',
    'QuestionLesson',
    'RuleAnimationPlayer',
    'ScenarioLesson',
    'Rulebook',
  ]
    .map((file) =>
      readFileSync(
        new URL(`../components/rulebook/${file}.tsx`, import.meta.url),
        'utf8',
      ),
    )
    .join('\n')
    .replace(/\s+/g, ' ');
  for (const text of lessonUiSources) {
    if (text === 'Question {0}') assert.match(source, /Question \$\{/);
    else assert.ok(source.includes(text), `UI source: ${text}`);
  }
  for (const locale of ['sk', 'de', 'ja']) {
    assert.deepEqual(
      new Set(Object.keys(lessonUiTranslations[locale])),
      new Set(lessonUiSources),
    );
    for (const text of lessonUiSources) {
      const translated = lessonUiTranslations[locale][text];
      assert.equal(typeof translated, 'string', `${locale}: ${text}`);
      assert.ok(translated.trim());
      assert.notEqual(translated, text);
      assert.doesNotMatch(translated, /\uFFFD/);
      assert.deepEqual(
        translated.match(/\{\d+\}/g) ?? [],
        text.match(/\{\d+\}/g) ?? [],
      );
    }
    // Answered/recorded progress must not promise correctness or a pass.
    for (const text of [
      'Questions answered',
      'Answer recorded',
      'questions answered',
      'All questions answered',
    ])
      assert.doesNotMatch(
        lessonUiTranslations[locale][text],
        /správn|úspešn|richtig|korrekt|bestanden|正解|合格/i,
      );
  }
});

test('generated lesson UI translations match every reviewed entry and question-number template', () => {
  for (const locale of ['sk', 'de', 'ja'])
    for (const [source, translated] of Object.entries(
      lessonUiTranslations[locale],
    )) {
      if (source.includes('{0}')) {
        for (const number of [1, 17, 111])
          assert.equal(
            translateText(source.replace('{0}', String(number)), locale),
            translated.replace('{0}', String(number)),
          );
      } else
        assert.equal(
          translateText(source, locale),
          translated,
          `${locale}: ${source}`,
        );
    }
});
