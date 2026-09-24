import { RULE_CLIPS, type RuleClip } from './animations';
import { rulebookCatalog } from './catalog';
import { CLIP_ASSESSMENTS, type ClipAssessment } from './clip-assessments';
import { LEARNING_SITUATIONS, type LearningSituation } from './learning';
import { LEARNING_OVERLAYS, OVERLAY_CLIP_ASSESSMENTS } from './overlays';
import type { LearningOverlay } from './overlay-types';
import { RULE_QUESTIONS, type RuleQuestion } from './questions';
import { SCENARIO_DECISION_TIMES } from './scenario-assessments';
import {
  REFEREE_CASES,
  ruleAnchor,
  type RefereeCase,
} from '../simulator/referee-cases';
import { SCENARIOS } from '../simulator/scenarios';
import type { ScenarioDefinition } from '../simulator/types';
import { RULESETS, getRuleset } from '../rulesets/registry';

/** Everything the Rules tab and the drill shuffle offer under one rule set. */
export type LearningBank = {
  rulesetId: string;
  cases: readonly RefereeCase[];
  clips: readonly RuleClip[];
  scenarios: readonly ScenarioDefinition[];
  questions: readonly RuleQuestion[];
  situations: readonly LearningSituation[];
  /** Title/explanation of live incidents built from an original case. */
  liveText: NonNullable<LearningOverlay['liveText']>;
};

type Entry =
  | { key: string; kind: 'case'; item: RefereeCase }
  | { key: string; kind: 'clip'; item: RuleClip }
  | { key: string; kind: 'scenario'; item: ScenarioDefinition }
  | { key: string; kind: 'question'; item: RuleQuestion };

function baseEntries(): Entry[] {
  // Same order as LEARNING_SITUATIONS: cases, clips, scenarios, questions.
  return [
    ...REFEREE_CASES.map(
      (item): Entry => ({ key: `case:${item.id}`, kind: 'case', item }),
    ),
    ...RULE_CLIPS.map(
      (item): Entry => ({ key: `clip:${item.id}`, kind: 'clip', item }),
    ),
    ...SCENARIOS.map(
      (item): Entry => ({ key: `scenario:${item.id}`, kind: 'scenario', item }),
    ),
    ...RULE_QUESTIONS.map(
      (item): Entry => ({ key: `question:${item.id}`, kind: 'question', item }),
    ),
  ];
}

function applyOverlay(entries: Entry[], overlay: LearningOverlay): Entry[] {
  const retired = new Set(overlay.retire);
  const scenarioSource = new Map(
    entries.flatMap((entry) =>
      entry.kind === 'scenario' ? [[entry.item.id, entry.item] as const] : [],
    ),
  );
  const reworded = entries.map((entry): Entry => {
    if (entry.kind === 'question') {
      const text = overlay.questionText?.[entry.item.id];
      return text ? { ...entry, item: { ...entry.item, ...text } } : entry;
    }
    if (entry.kind === 'case') {
      const text = overlay.caseText?.[entry.item.id];
      return text ? { ...entry, item: { ...entry.item, ...text } } : entry;
    }
    if (entry.kind === 'clip') {
      const text = overlay.clipText?.[entry.item.id];
      if (!text) return entry;
      const { frames, ...copy } = text;
      return {
        ...entry,
        item: {
          ...entry.item,
          ...copy,
          frames: entry.item.frames.map((frame, index) => ({
            ...frame,
            ...frames?.[index],
          })),
        },
      };
    }
    return entry;
  });
  const added: Entry[] = [
    ...overlay.cases.map(
      (item): Entry => ({ key: `case:${item.id}`, kind: 'case', item }),
    ),
    ...overlay.clips.map(
      (item): Entry => ({ key: `clip:${item.id}`, kind: 'clip', item }),
    ),
    ...overlay.scenarios.map((variant): Entry => {
      const source = scenarioSource.get(variant.basedOn);
      if (!source)
        throw new Error(
          `Scenario ${variant.id} is based on unknown scenario ${variant.basedOn}.`,
        );
      const { basedOn: _basedOn, ruleRef, ...copy } = variant;
      return {
        key: `scenario:${variant.id}`,
        kind: 'scenario',
        item: {
          ...source,
          ...copy,
          ruleRef: { ...source.ruleRef, ...ruleRef },
        },
      };
    }),
    ...overlay.questions.map(
      (item): Entry => ({ key: `question:${item.id}`, kind: 'question', item }),
    ),
  ];
  const placement = overlay.placement ?? {};
  const result = [...reworded];
  const unplaced: Entry[] = [];
  // Replacements take the position of the retired situation.
  for (const entry of added) {
    const target = placement[entry.key]?.replaces;
    if (!target) {
      unplaced.push(entry);
      continue;
    }
    const at = result.findIndex((candidate) => candidate.key === target);
    if (at < 0)
      throw new Error(`${entry.key} replaces unknown situation ${target}.`);
    result.splice(at + 1, 0, entry);
  }
  // `after` may name another added situation, so resolve until stable.
  let waiting = unplaced;
  for (let pass = 0; pass < added.length + 1 && waiting.length; pass++) {
    const next: Entry[] = [];
    for (const entry of waiting) {
      const target = placement[entry.key]?.after;
      if (!target) {
        next.push(entry);
        continue;
      }
      const at = result.findIndex((candidate) => candidate.key === target);
      if (at < 0) next.push(entry);
      else result.splice(at + 1, 0, entry);
    }
    if (next.length === waiting.length) break;
    waiting = next;
  }
  // Anything without a usable hint goes to the end of its own kind.
  for (const entry of waiting) {
    const last = result.map((item) => item.kind).lastIndexOf(entry.kind);
    result.splice(last + 1, 0, entry);
  }
  return result.filter((entry) => !retired.has(entry.key));
}

function overlayChain(rulesetId: string) {
  const chain: LearningOverlay[] = [];
  let cursor = getRuleset(rulesetId);
  while (cursor.basedOn) {
    const overlay = LEARNING_OVERLAYS[cursor.id];
    if (overlay) chain.unshift(overlay);
    const base = RULESETS.find((item) => item.id === cursor.basedOn);
    if (!base) break;
    cursor = base;
  }
  return chain;
}

const banks = new Map<string, LearningBank>();

export function learningBank(rulesetId?: string | null): LearningBank {
  const ruleset = getRuleset(rulesetId);
  const cached = banks.get(ruleset.id);
  if (cached) return cached;
  const chain = overlayChain(ruleset.id);
  let bank: LearningBank;
  if (!chain.length)
    // The original bank, by identity: certification is assigned from it.
    bank = {
      rulesetId: ruleset.id,
      cases: REFEREE_CASES,
      clips: RULE_CLIPS,
      scenarios: SCENARIOS,
      questions: RULE_QUESTIONS,
      situations: LEARNING_SITUATIONS,
      liveText: {},
    };
  else {
    const entries = chain.reduce(applyOverlay, baseEntries());
    const catalog = rulebookCatalog(ruleset.id);
    const sectionId = (anchor: string, owner: string) => {
      const section = catalog.sectionByAnchor('soccer', anchor);
      if (!section)
        throw new Error(
          `${owner} refers to #${anchor}, which the ${ruleset.id} soccer rules do not have.`,
        );
      return section.id;
    };
    const situations = entries.map((entry): LearningSituation => {
      if (entry.kind === 'case')
        return {
          id: entry.key,
          sourceId: entry.item.id,
          kind: 'case',
          title: entry.item.title,
          sectionId: sectionId(ruleAnchor(entry.item), entry.key),
        };
      if (entry.kind === 'clip')
        return {
          id: entry.key,
          sourceId: entry.item.id,
          kind: 'clip',
          title: entry.item.title,
          sectionId: sectionId(entry.item.anchor, entry.key),
          ...(entry.item.alsoAnchors
            ? {
                alsoSectionIds: entry.item.alsoAnchors.map((anchor) =>
                  sectionId(anchor, entry.key),
                ),
              }
            : {}),
        };
      if (entry.kind === 'scenario')
        return {
          id: entry.key,
          sourceId: entry.item.id,
          kind: 'scenario',
          title: entry.item.shortTitle,
          sectionId: sectionId(entry.item.ruleRef.url.split('#')[1], entry.key),
        };
      return {
        id: entry.key,
        sourceId: entry.item.id,
        kind: 'question',
        title: entry.item.title,
        sectionId: sectionId(entry.item.anchor, entry.key),
      };
    });
    const of = <K extends Entry['kind']>(kind: K) =>
      entries.flatMap((entry) =>
        entry.kind === kind
          ? [entry.item as Extract<Entry, { kind: K }>['item']]
          : [],
      );
    const clips = of('clip');
    bank = {
      rulesetId: ruleset.id,
      cases: of('case').map((item) => {
        const evidence = clips.find((clip) => clip.id === item.clip);
        return evidence ? { ...item, evidence } : item;
      }),
      clips,
      scenarios: of('scenario'),
      questions: of('question'),
      situations,
      liveText: Object.assign(
        {},
        ...chain.map((overlay) => overlay.liveText ?? {}),
      ),
    };
  }
  banks.set(ruleset.id, bank);
  return bank;
}

/** Progress and links are stored by id, so ids are valid across rule sets. */
export function allLearningSituationIds(): ReadonlySet<string> {
  return new Set(
    RULESETS.flatMap((ruleset) =>
      learningBank(ruleset.id).situations.map((item) => item.id),
    ),
  );
}

export function bankClipsFor(bank: LearningBank, anchor: string) {
  if (anchor === 'gameplay') return bank.clips;
  return bank.clips.filter(
    (clip) => clip.anchor === anchor || clip.alsoAnchors?.includes(anchor),
  );
}

export function clipAssessmentFor(id: string): ClipAssessment | undefined {
  return CLIP_ASSESSMENTS[id] ?? OVERLAY_CLIP_ASSESSMENTS[id];
}

/** A variant keeps the decision time of the scenario whose animation it reuses. */
export function scenarioDecisionTime(
  scenario: ScenarioDefinition,
): number | undefined {
  if (SCENARIO_DECISION_TIMES[scenario.id] !== undefined)
    return SCENARIO_DECISION_TIMES[scenario.id];
  for (const overlay of Object.values(LEARNING_OVERLAYS)) {
    const variant = overlay.scenarios.find((item) => item.id === scenario.id);
    if (variant) return SCENARIO_DECISION_TIMES[variant.basedOn];
  }
  return undefined;
}
