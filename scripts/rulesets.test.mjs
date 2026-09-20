import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

const repositoryUrl = new URL('../', import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      const path = specifier.slice(2);
      const url = new URL(
        /\.(?:ts|json)$/.test(path) ? path : `${path}.ts`,
        repositoryUrl,
      );
      return nextResolve(url.href, context);
    }
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

const {
  RULESETS,
  DEFAULT_RULESET_ID,
  CERTIFICATION_RULESET_ID,
  comparisonPartner,
  getRuleset,
  isRulesetId,
  rulesetOptionLabel,
} = await import('../lib/rulesets/registry.ts');
const { GAMEPLAY_RULESET_IDS, gameplayRulesFor, hasGameplayRules } =
  await import('../lib/rulesets/gameplay.ts');
const {
  RULESET_QUERY_KEY,
  RULESET_STORAGE_KEY,
  resolveRuleset,
  safeReadRuleset,
  safeWriteRuleset,
} = await import('../lib/rulesets/selection.ts');
const { compareRulesets, RULE_CHANGE_AREAS, RULE_CHANGE_IMPACTS } =
  await import('../lib/rulesets/compare.ts');
const { rulebookCatalog, RULE_SECTIONS, RULE_DOCUMENTS, guideFor } =
  await import('../lib/rulebook/catalog.ts');
const {
  learningBank,
  allLearningSituationIds,
  clipAssessmentFor,
  bankClipsFor,
} = await import('../lib/rulebook/learning-bank.ts');
const { LEARNING_OVERLAYS } = await import('../lib/rulebook/overlays.ts');
const { LEARNING_SITUATIONS } = await import('../lib/rulebook/learning.ts');
const { RULE_CLIPS } = await import('../lib/rulebook/animations.ts');
const { RULE_QUESTIONS } = await import('../lib/rulebook/questions.ts');
const { REFEREE_CASES, findRefereeCase, evidenceClip, ruleUrl } =
  await import('../lib/simulator/referee-cases.ts');
const { SCENARIOS } = await import('../lib/simulator/scenarios.ts');
const { INITIAL_NAVIGATION, navigationSearch, readNavigation } =
  await import('../lib/simulator/navigation.ts');
const certificationPolicy = await import('../lib/certification/policy.ts');

const DOCUMENT_IDS = [
  'soccer',
  'field',
  'ball',
  'scoring',
  'superteam',
  'entry',
];
const memoryStorage = (initial = {}) => {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
};

test('rule sets are registered once, oldest first, with matching gameplay rules', () => {
  const ids = RULESETS.map((ruleset) => ruleset.id);
  assert.ok(ids.length >= 2);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...GAMEPLAY_RULESET_IDS], ids);
  assert.deepEqual(ids, [...ids].sort(), 'keep seasons in chronological order');
  assert.equal(RULESETS[0].basedOn, null);
  RULESETS.forEach((ruleset, index) => {
    assert.match(ruleset.id, /^\d{4}(?:-[a-z0-9]+)?$/);
    assert.ok(['final', 'draft'].includes(ruleset.status), ruleset.id);
    assert.ok(ruleset.label && ruleset.shortLabel && ruleset.title, ruleset.id);
    assert.ok(hasGameplayRules(ruleset.id), ruleset.id);
    assert.equal(ruleset.gameplay, gameplayRulesFor(ruleset.id), ruleset.id);
    assert.ok(Object.isFrozen(ruleset.gameplay), ruleset.id);
    if (index > 0) {
      assert.ok(ids.slice(0, index).includes(ruleset.basedOn), ruleset.id);
      assert.ok(ruleset.changes.length > 0, `${ruleset.id} lists no changes`);
    } else assert.deepEqual(ruleset.changes, []);
  });
  // Every folder under lib/rulesets is a registered season, and the reverse.
  const folders = readdirSync(new URL('../lib/rulesets/', import.meta.url), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(folders, [...ids].sort());
});

test('reading progress keys are unique, and the first season keeps its original key', () => {
  const keys = RULESETS.map((ruleset) => ruleset.readingProgressKey);
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(
    getRuleset('2026').readingProgressKey,
    'rcj-rulebook-read-2026-06-03-v1',
  );
});

test('the default is a final rule set and certification stays on its assigned rules', () => {
  assert.equal(getRuleset(DEFAULT_RULESET_ID).status, 'final');
  assert.equal(CERTIFICATION_RULESET_ID, '2026');
  assert.equal(getRuleset(CERTIFICATION_RULESET_ID).status, 'final');
  const policies = Object.values(certificationPolicy).filter(
    (value) => value && typeof value === 'object' && 'rulesetVersion' in value,
  );
  assert.ok(policies.length > 0, 'certification policy not found');
  for (const policy of policies)
    assert.match(
      policy.rulesetVersion,
      new RegExp(`${CERTIFICATION_RULESET_ID}$`),
    );
  // The certified engine reads exactly these parameters when nothing is chosen.
  assert.equal(gameplayRulesFor(), gameplayRulesFor(CERTIFICATION_RULESET_ID));
  assert.equal(
    gameplayRulesFor('1999'),
    gameplayRulesFor(CERTIFICATION_RULESET_ID),
  );
  assert.equal(
    gameplayRulesFor(null),
    gameplayRulesFor(CERTIFICATION_RULESET_ID),
  );
});

test('unknown ids fall back, and labels mark drafts', () => {
  assert.equal(isRulesetId('2027'), true);
  for (const value of ['', '2030', null, undefined, 2027, {}])
    assert.equal(isRulesetId(value), false, JSON.stringify(value));
  assert.equal(getRuleset('2030').id, DEFAULT_RULESET_ID);
  assert.equal(getRuleset(null).id, DEFAULT_RULESET_ID);
  for (const ruleset of RULESETS)
    assert.equal(
      rulesetOptionLabel(ruleset),
      ruleset.status === 'draft' ? `${ruleset.label} · draft` : ruleset.label,
    );
  assert.equal(comparisonPartner('2027'), '2026');
  assert.equal(comparisonPartner('2026'), '2027');
  for (const ruleset of RULESETS)
    assert.notEqual(comparisonPartner(ruleset.id), ruleset.id);
});

test('the selected rule set comes from the link, then the device, then the default', () => {
  assert.equal(resolveRuleset({}), DEFAULT_RULESET_ID);
  assert.equal(resolveRuleset({ search: '?ruleset=2027' }), '2027');
  assert.equal(
    resolveRuleset({ search: '?ruleset=2027', stored: '2026' }),
    '2027',
  );
  assert.equal(
    resolveRuleset({ search: '?mode=play', stored: '2027' }),
    '2027',
  );
  assert.equal(
    resolveRuleset({ search: '?ruleset=1999', stored: '2027' }),
    '2027',
  );
  assert.equal(
    resolveRuleset({ search: '?ruleset=1999', stored: 'x' }),
    DEFAULT_RULESET_ID,
  );
  // `rule` selects a section and must never be mistaken for the rule set.
  assert.equal(RULESET_QUERY_KEY, 'ruleset');
  assert.equal(resolveRuleset({ search: '?rule=2027' }), DEFAULT_RULESET_ID);

  const storage = memoryStorage();
  assert.equal(safeReadRuleset(storage), null);
  assert.equal(safeWriteRuleset(storage, '2027'), true);
  assert.equal(storage.getItem(RULESET_STORAGE_KEY), '2027');
  assert.equal(safeReadRuleset(storage), '2027');
  assert.equal(
    safeReadRuleset(memoryStorage({ [RULESET_STORAGE_KEY]: 'old' })),
    null,
  );
  const blocked = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
  };
  assert.equal(safeReadRuleset(blocked), null);
  assert.equal(safeWriteRuleset(blocked, '2027'), false);
  assert.equal(safeWriteRuleset(null, '2027'), false);
});

test('links carry the rule set and the comparison partner', () => {
  assert.equal(readNavigation('?mode=compare&with=2027').mode, 'compare');
  assert.equal(readNavigation('?mode=compare&with=2027').compareWith, '2027');
  assert.equal(readNavigation('?mode=compare&with=1999').compareWith, null);
  assert.equal(readNavigation('?mode=compare').compareWith, null);
  assert.equal(INITIAL_NAVIGATION.compareWith, null);

  const compare = new URLSearchParams(
    navigationSearch(
      { ...INITIAL_NAVIGATION, mode: 'compare', compareWith: '2026' },
      'robot',
      'de',
      '2027',
    ),
  );
  assert.equal(compare.get('mode'), 'compare');
  assert.equal(compare.get('ruleset'), '2027');
  assert.equal(compare.get('with'), '2026');
  assert.equal(compare.get('lang'), 'de');

  const rules = new URLSearchParams(
    navigationSearch(
      { ...INITIAL_NAVIGATION, situationId: 'case:pushing-line-2027' },
      'robot',
      'en',
      '2027',
    ),
  );
  assert.equal(rules.get('ruleset'), '2027');
  assert.equal(rules.get('with'), null);
  assert.equal(rules.get('situation'), 'case:pushing-line-2027');
  // Older callers that pass no rule set produce the links they always did.
  assert.equal(
    new URLSearchParams(navigationSearch(INITIAL_NAVIGATION, 'robot')).has(
      'ruleset',
    ),
    false,
  );
});

test('every rule set indexes the six official documents with unique sections', () => {
  for (const ruleset of RULESETS) {
    const catalog = rulebookCatalog(ruleset.id);
    assert.equal(catalog.rulesetId, ruleset.id);
    assert.deepEqual(
      catalog.documents.map((document) => document.id),
      DOCUMENT_IDS,
    );
    assert.match(catalog.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    const ids = catalog.sections.map((section) => section.id);
    assert.equal(new Set(ids).size, ids.length, ruleset.id);
    for (const document of catalog.documents) {
      assert.match(document.url, /^https:\/\/robocup-junior\.github\.io\//);
      assert.match(document.revision, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(document.contentSha256, /^[0-9a-f]{64}$/);
      assert.equal(catalog.documentUrl(document.id), document.url);
      const sections = catalog.sections.filter(
        (section) => section.document === document.id,
      );
      assert.equal(
        sections.length,
        document.headingCount + Number(document.footnoteCount > 0),
        `${ruleset.id}/${document.id}`,
      );
    }
    for (const section of catalog.sections) {
      assert.equal(catalog.section(section.id), section);
      // A few headings of the published pages share one anchor.
      const byAnchor = catalog.sectionByAnchor(
        section.document,
        section.anchor,
      );
      assert.equal(byAnchor.document, section.document);
      assert.equal(byAnchor.anchor, section.anchor);
      assert.ok(catalog.sectionUrl(section).endsWith(`#${section.anchor}`));
      assert.ok(guideFor(section));
    }
    assert.equal(catalog.section('soccer:no-such-section'), undefined);
    assert.ok(catalog.findSections('kick').length > 0);
  }
  // The historical exports still describe the certification rule set.
  assert.equal(
    RULE_SECTIONS,
    rulebookCatalog(CERTIFICATION_RULESET_ID).sections,
  );
  assert.equal(
    RULE_DOCUMENTS,
    rulebookCatalog(CERTIFICATION_RULESET_ID).documents,
  );
  assert.equal(rulebookCatalog('1999').rulesetId, DEFAULT_RULESET_ID);
});

test('the 2027 draft index uses the intended gameplay numbering', () => {
  const catalog = rulebookCatalog('2027');
  const numbers = Object.fromEntries(
    catalog.sections
      .filter((section) => section.document === 'soccer')
      .map((section) => [section.anchor, section.number]),
  );
  assert.equal(numbers['pre-match-meeting'], '2.2');
  assert.equal(numbers['kick-off'], '2.3');
  assert.equal(numbers['neutral-kickoff'], '2.3.1');
  assert.equal(numbers['inside-penalty-area'], '2.6');
  assert.equal(numbers['lack-of-progress'], '2.7');
  assert.equal(numbers['out-of-bounds'], '2.8');
  assert.equal(numbers['damaged-robots'], '2.9');
  assert.match(getRuleset('2027').index.note ?? '', /\S/);
  const gameplay = catalog.sectionByAnchor('soccer', 'out-of-bounds');
  assert.ok(catalog.noticesFor(gameplay).length > 0);
  assert.deepEqual(
    catalog.noticesFor(
      catalog.sectionByAnchor('soccer', 'kicker-power-measuring'),
    ),
    [],
  );
  assert.deepEqual(
    rulebookCatalog('2026').noticesFor(
      rulebookCatalog('2026').sectionByAnchor('soccer', 'out-of-bounds'),
    ),
    [],
  );
});

test('changes, assumptions and notices point at real sections and situations', () => {
  const areas = new Set(RULE_CHANGE_AREAS.map((area) => area.id));
  const impacts = new Set(RULE_CHANGE_IMPACTS.map((impact) => impact.id));
  for (const ruleset of RULESETS) {
    const catalog = rulebookCatalog(ruleset.id);
    const previous = ruleset.basedOn ? rulebookCatalog(ruleset.basedOn) : null;
    const situations = new Set(
      learningBank(ruleset.id).situations.map((situation) => situation.id),
    );
    const assumptions = new Set(ruleset.assumptions.map((item) => item.id));
    assert.equal(assumptions.size, ruleset.assumptions.length, ruleset.id);
    const changeIds = ruleset.changes.map((change) => change.id);
    assert.equal(new Set(changeIds).size, changeIds.length, ruleset.id);
    for (const change of ruleset.changes) {
      const where = `${ruleset.id}/${change.id}`;
      assert.ok(areas.has(change.area), where);
      assert.ok(impacts.has(change.impact), where);
      assert.ok(['added', 'changed', 'removed'].includes(change.kind), where);
      assert.ok(change.title && change.before && change.after, where);
      if (change.kind !== 'removed')
        assert.ok(
          catalog.sectionByAnchor(change.document, change.anchor),
          `${where}: #${change.anchor} is not in the ${ruleset.id} index`,
        );
      if (change.kind !== 'added' && previous)
        assert.ok(
          previous.sectionByAnchor(
            change.document,
            change.previousAnchor ?? change.anchor,
          ),
          `${where}: #${change.previousAnchor ?? change.anchor} is not in the ${ruleset.basedOn} index`,
        );
      if (change.impact === 'referee')
        assert.ok(
          change.effect && change.simulator,
          `${where}: say what to do`,
        );
      for (const id of change.assumptions ?? [])
        assert.ok(assumptions.has(id), `${where}: unknown assumption ${id}`);
      for (const id of change.practice ?? [])
        assert.ok(situations.has(id), `${where}: unknown situation ${id}`);
    }
    for (const assumption of ruleset.assumptions) {
      assert.ok(
        ruleset.changes.some((change) =>
          change.assumptions?.includes(assumption.id),
        ),
        `${ruleset.id}/${assumption.id} is not linked from a change`,
      );
      for (const anchor of assumption.anchors)
        assert.ok(
          catalog.sectionByAnchor('soccer', anchor),
          `${assumption.id}: ${anchor}`,
        );
    }
    for (const notice of ruleset.sourceNotices)
      for (const anchor of notice.anchors)
        assert.ok(
          catalog.sectionByAnchor(notice.document, anchor),
          `${ruleset.id}/${notice.id}: ${anchor}`,
        );
  }
});

test('comparing two versions works in both directions and for one version', () => {
  const forward = compareRulesets('2026', '2027');
  const backward = compareRulesets('2027', '2026');
  assert.equal(forward.older.id, '2026');
  assert.equal(forward.newer.id, '2027');
  assert.equal(forward.reversed, false);
  assert.equal(backward.reversed, true);
  assert.equal(backward.older.id, '2026');
  assert.deepEqual(
    backward.changes.map((change) => change.id),
    forward.changes.map((change) => change.id),
  );
  assert.equal(forward.connected, true);
  assert.equal(forward.changes.length, getRuleset('2027').changes.length);
  assert.deepEqual(forward.assumptions, getRuleset('2027').assumptions);
  for (const change of forward.changes) {
    assert.deepEqual(change.step, { from: '2026', to: '2027' });
    if (change.kind !== 'removed') assert.ok(change.newerSection, change.id);
    if (change.kind !== 'added') assert.ok(change.olderSection, change.id);
  }
  assert.deepEqual(
    forward.documents.map((document) => document.id),
    DOCUMENT_IDS,
  );
  const soccer = forward.documents.find((document) => document.id === 'soccer');
  assert.equal(soccer.contentChanged, true);
  assert.ok(
    soccer.sections.some(
      (difference) =>
        difference.kind === 'added' &&
        difference.newer?.anchor ===
          '_changes_from_the_2026_robocupjunior_soccer_rules',
    ),
  );
  for (const document of forward.documents.filter(
    (item) => item.id !== 'soccer',
  )) {
    assert.equal(document.contentChanged, false, document.id);
    assert.deepEqual(document.sections, [], document.id);
  }
  // Every change of the soccer rules sits in a document whose text differs.
  for (const change of forward.changes)
    assert.equal(
      forward.documents.find((document) => document.id === change.document)
        .contentChanged,
      true,
      change.id,
    );

  const same = compareRulesets('2027', '2027');
  assert.equal(same.older.id, same.newer.id);
  assert.deepEqual(same.changes, []);
  assert.deepEqual(same.assumptions, []);
  assert.ok(same.documents.every((document) => !document.contentChanged));
});

test('the original learning bank is untouched and later seasons build on it', () => {
  const original = learningBank('2026');
  assert.equal(original.situations, LEARNING_SITUATIONS);
  assert.equal(original.clips, RULE_CLIPS);
  assert.equal(original.questions, RULE_QUESTIONS);
  assert.equal(original.cases, REFEREE_CASES);
  assert.equal(original.scenarios, SCENARIOS);
  assert.equal(learningBank().situations, LEARNING_SITUATIONS);
  assert.equal(learningBank('1999').situations, LEARNING_SITUATIONS);
  assert.equal(LEARNING_OVERLAYS['2026'], undefined);
  // Certification question manifests are frozen against this exact bank.
  assert.equal(LEARNING_SITUATIONS.length, 111);

  const draft = learningBank('2027');
  assert.equal(draft.rulesetId, '2027');
  assert.notEqual(draft.situations, LEARNING_SITUATIONS);
  assert.ok(draft.situations.length > LEARNING_SITUATIONS.length);
  assert.equal(learningBank('2027'), draft, 'banks are built once');
});

test('every season keeps its learning situations consistent', () => {
  const all = allLearningSituationIds();
  for (const ruleset of RULESETS) {
    const bank = learningBank(ruleset.id);
    const catalog = rulebookCatalog(ruleset.id);
    const ids = bank.situations.map((situation) => situation.id);
    assert.equal(new Set(ids).size, ids.length, ruleset.id);
    assert.equal(
      bank.situations.length,
      bank.cases.length +
        bank.clips.length +
        bank.scenarios.length +
        bank.questions.length,
      ruleset.id,
    );
    for (const situation of bank.situations) {
      assert.ok(all.has(situation.id), situation.id);
      assert.ok(
        catalog.section(situation.sectionId),
        `${ruleset.id}/${situation.id}: ${situation.sectionId}`,
      );
      assert.ok(situation.title && situation.sourceId, situation.id);
    }
    for (const clip of bank.clips) {
      assert.ok(clipAssessmentFor(clip.id), `${clip.id} has no decision time`);
      const last = clip.frames[clip.frames.length - 1].at;
      assert.ok(
        clipAssessmentFor(clip.id).decisionAt <= last + 1e-9,
        `${clip.id}: decision after the last frame`,
      );
      assert.ok(clip.answer >= 0 && clip.answer < clip.options.length, clip.id);
      assert.ok(bankClipsFor(bank, clip.anchor).includes(clip), clip.id);
    }
    for (const question of bank.questions)
      assert.ok(
        question.answer >= 0 && question.answer < question.options.length,
        question.id,
      );
    for (const item of bank.cases) {
      assert.equal(findRefereeCase(item.id)?.id, item.id);
      assert.ok(evidenceClip(item), `${item.id}: clip ${item.clip}`);
      assert.ok(
        ruleUrl(item, ruleset.id).startsWith(catalog.documentUrl('soccer')),
        item.id,
      );
    }
  }
});

test('overlays retire, reword and place situations that really exist', () => {
  for (const [id, overlay] of Object.entries(LEARNING_OVERLAYS)) {
    assert.equal(overlay.rulesetId, id);
    const ruleset = getRuleset(id);
    assert.equal(ruleset.id, id, `${id} is not registered`);
    const base = learningBank(ruleset.basedOn);
    const baseIds = new Set(base.situations.map((situation) => situation.id));
    const bank = learningBank(id);
    const ids = new Set(bank.situations.map((situation) => situation.id));
    for (const retired of overlay.retire) {
      assert.ok(baseIds.has(retired), `${id}: retires unknown ${retired}`);
      assert.ok(!ids.has(retired), `${id}: ${retired} is still listed`);
    }
    const added = [
      ...overlay.cases.map((item) => `case:${item.id}`),
      ...overlay.clips.map((item) => `clip:${item.id}`),
      ...overlay.questions.map((item) => `question:${item.id}`),
      ...overlay.scenarios.map((item) => `scenario:${item.id}`),
    ];
    for (const situation of added) {
      assert.ok(ids.has(situation), `${id}: ${situation} is not listed`);
      assert.ok(!baseIds.has(situation), `${id}: ${situation} reuses an id`);
      assert.match(
        situation,
        new RegExp(`-${id}$`),
        'suffix new ids with the season',
      );
    }
    for (const key of Object.keys(overlay.questionText ?? {}))
      assert.ok(ids.has(`question:${key}`), `${id}: question ${key}`);
    for (const key of Object.keys(overlay.clipText ?? {}))
      assert.ok(ids.has(`clip:${key}`), `${id}: clip ${key}`);
    for (const key of Object.keys(overlay.caseText ?? {}))
      assert.ok(ids.has(`case:${key}`), `${id}: case ${key}`);
    for (const [situation, placement] of Object.entries(
      overlay.placement ?? {},
    )) {
      assert.ok(
        added.includes(situation),
        `${id}: places unknown ${situation}`,
      );
      if (placement.replaces)
        assert.ok(overlay.retire.includes(placement.replaces), situation);
      if (placement.after)
        assert.ok(
          ids.has(placement.after) || baseIds.has(placement.after),
          `${situation}: after ${placement.after}`,
        );
    }
    // Reworded situations keep their id and their correct answer.
    for (const [key, text] of Object.entries(overlay.questionText ?? {})) {
      const before = base.questions.find((question) => question.id === key);
      const after = bank.questions.find((question) => question.id === key);
      assert.equal(after.answer, before.answer, key);
      assert.equal(after.options.length, before.options.length, key);
      if (text.question) assert.equal(after.question, text.question);
      assert.notEqual(after, before, 'the original object is never edited');
    }
  }
  // The base objects were not modified while building later banks.
  assert.equal(
    RULE_QUESTIONS.find((question) => question.id === 'infrared-dimensions')
      .question,
    learningBank('2026').questions.find(
      (question) => question.id === 'infrared-dimensions',
    ).question,
  );
  assert.notEqual(
    learningBank('2027').questions.find(
      (question) => question.id === 'infrared-dimensions',
    ).question,
    RULE_QUESTIONS.find((question) => question.id === 'infrared-dimensions')
      .question,
  );
});

test('the 2027 bank teaches the new rules and no longer the replaced ones', () => {
  const bank = learningBank('2027');
  const ids = new Set(bank.situations.map((situation) => situation.id));
  for (const id of [
    'case:pushing-line-2027',
    'case:pushing-short-2027',
    'case:attackers-area-2027',
    'case:holding-2027',
    'case:out-goal-teammate-2027',
    'case:out-goal-scorer-2027',
    'case:out-return-kickoff-2027',
    'case:out-return-served-2027',
    'case:out-return-running-2027',
    'case:progress-return-first-2027',
    'case:all-out-2027',
    'case:pushed-ramp-2027',
    'clip:pushing-line-2027',
    'question:late-team-loss-2027',
    'question:kicker-vertical-setup-2027',
    'scenario:illegal-ball-holding-2027',
  ])
    assert.ok(ids.has(id), id);
  for (const id of [
    'case:pushing',
    'case:out-goal',
    'case:holding',
    'clip:contact-midfield',
    'question:kicker-test-setup',
    'question:return-placement',
    'scenario:pushing-discretion',
  ])
    assert.ok(!ids.has(id), `${id} teaches a 2026 answer`);
  // A repaired damaged robot still returns at a kick-off under the draft.
  assert.ok(ids.has('case:return-kickoff'));
  // Replacements take the list position of what they replace.
  const order = bank.cases.map((item) => item.id);
  const original = learningBank('2026').cases.map((item) => item.id);
  assert.equal(
    order.indexOf('out-goal-teammate-2027'),
    original.indexOf('out-goal'),
  );
  assert.equal(
    order.indexOf('out-goal-scorer-2027'),
    order.indexOf('out-goal-teammate-2027') + 1,
  );
  assert.ok(
    order.indexOf('pushing-line-2027') < order.indexOf('midfield') &&
      original.indexOf('pushing') < original.indexOf('midfield'),
  );
});

test('the app, the tests and the docs name every registered rule set', () => {
  const guide = readFileSync(
    new URL('../docs/adding-a-rules-version.md', import.meta.url),
    'utf8',
  );
  for (const file of [
    'lib/rulesets/registry.ts',
    'lib/rulesets/gameplay.ts',
    'lib/rulebook/overlays.ts',
    'scripts/ruleset-translations.mjs',
    'scripts/sync-rulebook.py',
  ])
    assert.ok(guide.includes(file), `the guide does not mention ${file}`);
  for (const ruleset of RULESETS) {
    const sources = JSON.parse(
      readFileSync(
        new URL(`../lib/rulesets/${ruleset.id}/sources.json`, import.meta.url),
        'utf8',
      ),
    );
    assert.equal(sources.id, ruleset.id);
    assert.deepEqual(
      sources.documents.map((document) => document.id),
      DOCUMENT_IDS,
      ruleset.id,
    );
  }
});
