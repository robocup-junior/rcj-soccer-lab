import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';
import translations from './ruleset-translations.mjs';

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

const { RULESETS, rulesetOptionLabel } =
  await import('../lib/rulesets/registry.ts');
const { RULE_CHANGE_AREAS, RULE_CHANGE_IMPACTS } =
  await import('../lib/rulesets/compare.ts');
const { LEARNING_OVERLAYS } = await import('../lib/rulebook/overlays.ts');
const { translateText } = await import('../lib/i18n/index.ts');
const runtime = JSON.parse(
  readFileSync(
    new URL('../lib/i18n/catalog.generated.json', import.meta.url),
    'utf8',
  ),
);

const { RULE_CLIPS } = await import('../lib/rulebook/animations.ts');
const { RULE_QUESTIONS } = await import('../lib/rulebook/questions.ts');
const { CLIP_ASSESSMENTS } =
  await import('../lib/rulebook/clip-assessments.ts');
const { REFEREE_CASES } = await import('../lib/simulator/referee-cases.ts');
const { SCENARIOS } = await import('../lib/simulator/scenarios.ts');

const LOCALES = ['sk', 'de', 'ja'];
/**
 * New copy of a rule set needs reviewed rows in scripts/ruleset-translations/.
 * List a rule set here only to ship it with machine translation for a while.
 */
const MACHINE_TRANSLATED_RULESETS = [];
const normalize = (text) => text.trim().replace(/\s+/g, ' ');
const swapTeams = (text) =>
  text
    .replaceAll('Blue', '<team>')
    .replaceAll('Yellow', 'Blue')
    .replaceAll('<team>', 'Yellow');

/** Every sentence a rule set shows: labels, changes, assumptions, notices. */
function rulesetCopy(ruleset) {
  return [
    ruleset.label,
    ruleset.title,
    ruleset.soccerDocumentLabel,
    ...ruleset.changes.flatMap((change) => [
      change.title,
      change.before,
      change.after,
      change.effect,
      change.simulator,
    ]),
    ...ruleset.assumptions.flatMap((assumption) => [
      assumption.title,
      assumption.question,
      assumption.choice,
    ]),
    ...ruleset.sourceNotices.map((notice) => notice.text),
  ]
    .filter(Boolean)
    .map(normalize);
}

/** Every sentence a learning overlay adds or rewords. */
function overlayCopy(overlay) {
  const question = (item) => [
    item.title,
    item.question,
    ...(item.options ?? []),
    item.feedback,
  ];
  return [
    ...overlay.questions.flatMap(question),
    ...[...overlay.clips, ...(overlay.sceneClips ?? [])].flatMap((clip) => [
      ...question(clip),
      ...clip.frames.flatMap((frame) => [frame.label, frame.readout]),
    ]),
    ...overlay.cases.flatMap((item) => [
      item.title,
      item.facts,
      item.before,
      item.explanation,
    ]),
    ...overlay.scenarios.flatMap((scenario) => [
      scenario.title,
      scenario.shortTitle,
      scenario.publicSummary,
      scenario.refereeCue,
      scenario.ruleRef?.title,
      scenario.ruleRef?.summary,
      ...scenario.choices.flatMap((choice) => [choice.label, choice.feedback]),
    ]),
    ...Object.values(overlay.questionText ?? {}).flatMap(question),
    ...Object.values(overlay.clipText ?? {}).flatMap((clip) => [
      ...question(clip),
      ...Object.values(clip.frames ?? {}).flatMap((frame) => [
        frame.label,
        frame.readout,
      ]),
    ]),
    ...Object.values(overlay.caseText ?? {}).flatMap((item) => [
      item.title,
      item.facts,
      item.before,
      item.explanation,
    ]),
    ...Object.values(overlay.liveText ?? {}).flatMap((item) => [
      item.title,
      item.explanation,
    ]),
    ...Object.values(overlay.clipAssessments ?? {}).map((item) => item.context),
  ]
    .filter((text) => typeof text === 'string' && /\p{L}/u.test(text))
    .map(normalize);
}

const shipped = (locale, source) =>
  runtime.locales[locale].exact[source] ??
  runtime.locales[locale].patterns.find((entry) => entry.source === source)
    ?.translation;

test('reviewed rule-set translations cover all three languages', () => {
  assert.deepEqual(Object.keys(translations), LOCALES);
  const sources = Object.keys(translations.sk);
  assert.ok(sources.length >= 400, `only ${sources.length} reviewed rows`);
  for (const locale of LOCALES) {
    assert.deepEqual(Object.keys(translations[locale]), sources, locale);
    for (const [source, translated] of Object.entries(translations[locale])) {
      assert.ok(translated.trim(), `${locale}: ${source}`);
      assert.doesNotMatch(
        translated,
        /\uFFFD|https?:\/\/|<\/?[a-z]/i,
        `${locale}: ${source}`,
      );
    }
  }
});

test('the shipped catalogue uses every reviewed row, so none of them is stale', () => {
  for (const locale of LOCALES)
    for (const [source, reviewed] of Object.entries(translations[locale]))
      assert.equal(
        shipped(locale, source),
        reviewed,
        `${locale}: "${source}" is missing from lib/i18n/catalog.generated.json. ` +
          'If the English text changed, update the row and run pnpm i18n:generate.',
      );
});

test('new copy of every rule set is in the catalogue and has reviewed rows', () => {
  // Sentences that a season reuses from the original bank keep the
  // translation they already have.
  const original = new Set(
    overlayCopy({
      questions: RULE_QUESTIONS,
      clips: RULE_CLIPS,
      cases: REFEREE_CASES,
      scenarios: SCENARIOS,
      clipAssessments: CLIP_ASSESSMENTS,
    }),
  );
  for (const ruleset of RULESETS) {
    const overlay = LEARNING_OVERLAYS[ruleset.id];
    const copy = new Set([
      ...rulesetCopy(ruleset),
      ...(overlay ? overlayCopy(overlay) : []),
    ]);
    assert.ok(copy.size > 0, ruleset.id);
    for (const source of copy) {
      for (const variant of new Set([source, swapTeams(source)])) {
        for (const locale of LOCALES) {
          const translated = shipped(locale, variant);
          assert.ok(
            translated,
            `${ruleset.id}/${locale}: "${variant}" is not in the catalogue; run pnpm i18n:generate.`,
          );
          if (
            original.has(source) ||
            MACHINE_TRANSLATED_RULESETS.includes(ruleset.id)
          )
            continue;
          assert.equal(
            translations[locale][variant],
            translated,
            `${ruleset.id}/${locale}: "${variant}" has no reviewed row in scripts/ruleset-translations/.`,
          );
        }
      }
    }
  }
});

test('labels of the comparison tab are reviewed', () => {
  for (const { label } of [...RULE_CHANGE_AREAS, ...RULE_CHANGE_IMPACTS])
    for (const locale of LOCALES)
      assert.ok(shipped(locale, normalize(label)), `${locale}: ${label}`);
});

test('reviewed rows keep robot names, numbers and the agreed terms', () => {
  const terms = [
    [
      /pushing line/i,
      {
        sk: /čiar\p{L}* tlačenia/iu,
        de: /Pushing-Linie/iu,
        ja: /プッシングライン/iu,
      },
    ],
    [
      /multiple defense|multiple-defense/i,
      { sk: /viacnásobn/iu, de: /Mehrfachverteidigung/iu, ja: /複数守備/iu },
    ],
    [
      /neutral kick-?off/i,
      {
        sk: /neutráln\p{L}* výkop|Neutral kickoff/iu,
        de: /neutrale\p{L}* Anstoß|Neutral kickoff/iu,
        ja: /ニュートラルキックオフ|Neutral kickoff/iu,
      },
    ],
    [
      /lack of progress|lack-of-progress/i,
      {
        sk: /nedostat\p{L}* pokroku/iu,
        de: /mangelnde\p{L}* Spielfortschritt/iu,
        ja: /進行の停滞/iu,
      },
    ],
    [
      /inspection sticker/i,
      {
        sk: /nálepk\p{L}* z technickej kontroly/iu,
        de: /Inspektionsaufkleber/iu,
        ja: /検査ステッカー/iu,
      },
    ],
    [
      /own corner/i,
      {
        sk: /vlastn\p{L}* roh/iu,
        de: /eigene\p{L}* Ecke/iu,
        ja: /自陣.{0,8}コーナー/iu,
      },
    ],
  ];
  for (const [source, row] of Object.entries(translations.sk)) {
    for (const locale of LOCALES) {
      const translated = translations[locale][source];
      for (const name of source.match(/\b(?:Blue|Yellow) [12]\b/g) ?? [])
        assert.ok(translated.includes(name), `${locale}: ${name}: ${source}`);
      for (const number of source.match(/\d+(?:[.,–-]\d+)?/g) ?? []) {
        const localized = number.replace('.', locale === 'ja' ? '.' : ',');
        assert.ok(
          translated.includes(number) || translated.includes(localized),
          `${locale}: ${number}: ${source}`,
        );
      }
      for (const [pattern, expected] of terms)
        if (pattern.test(source))
          assert.match(translated, expected[locale], `${locale}: ${source}`);
    }
    assert.ok(row);
  }
});

test('team-swapped drills read the same as their originals', () => {
  const source =
    'Blue pushes the ball and the Yellow defender back until the defender reaches the pushing line. What do you call under the 2027 draft?';
  const mirrored = swapTeams(source);
  assert.notEqual(mirrored, source);
  assert.match(translations.sk[source], /^Modrý tím .* žltého obrancu/);
  assert.match(translations.sk[mirrored], /^Žltý tím .* modrého obrancu/);
  assert.match(translations.de[source], /^Blau .* von Gelb/);
  assert.match(translations.de[mirrored], /^Gelb .* von Blau/);
  assert.match(translations.ja[source], /^青が.*黄の守備ロボット/);
  assert.match(translations.ja[mirrored], /^黄が.*青の守備ロボット/);
});

test('dynamic labels of the version selector translate at runtime', () => {
  const draft = RULESETS.find((ruleset) => ruleset.status === 'draft');
  if (draft) {
    const label = rulesetOptionLabel(draft);
    assert.equal(translateText(label, 'sk'), 'Pravidlá 2027 · návrh');
    assert.equal(translateText(label, 'de'), 'Regeln 2027 · Entwurf');
    assert.equal(translateText(label, 'ja'), '2027年ルール · ドラフト');
  }
  assert.equal(
    translateText('Changed from the 2026 rules', 'de'),
    'Geändert gegenüber den Regeln 2026',
  );
  assert.equal(
    translateText('AI MATCH / REFEREE / 2027', 'sk'),
    'AI ZÁPAS / ROZHODCA / 2027',
  );
  assert.equal(
    translateText('Certification uses the 2026 rules.', 'ja'),
    '認定では2026年ルールを使用します。',
  );
  assert.equal(
    translateText('Read §2.6 in the Rules tab', 'sk'),
    'Čítať §2.6 na karte Pravidlá',
  );
  assert.equal(
    translateText(
      'Yellow 1 requests return. Its minimum penalty runs for another 35 seconds; the pending kickoff does not shorten it.',
      'de',
    ),
    'Yellow 1 möchte zurückkehren. Seine Mindeststrafe läuft noch 35 Sekunden; der anstehende Anstoß verkürzt sie nicht.',
  );
});
