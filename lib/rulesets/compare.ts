import { RULESETS, getRuleset, rulesetPosition } from './registry';
import type {
  OfficialDocument,
  OfficialSection,
  RuleChange,
  RulesetDefinition,
  TrainingAssumption,
} from './types';

export type ComparedChange = RuleChange & {
  /** The revision step this change belongs to, e.g. 2026 to 2027. */
  step: { from: string; to: string };
  /** Section in the OLDER rule set of the comparison, if it exists there. */
  olderSection: OfficialSection | null;
  /** Section in the NEWER rule set of the comparison, if it exists there. */
  newerSection: OfficialSection | null;
};

export type SectionDifference = {
  kind: 'added' | 'removed' | 'renumbered' | 'retitled';
  document: string;
  anchor: string;
  older: OfficialSection | null;
  newer: OfficialSection | null;
};

export type DocumentDifference = {
  id: string;
  title: string;
  older: OfficialDocument | null;
  newer: OfficialDocument | null;
  /** Null when either index predates content hashes. */
  contentChanged: boolean | null;
  sections: SectionDifference[];
};

export type RulesetComparison = {
  older: RulesetDefinition;
  newer: RulesetDefinition;
  /** The user asked for newer → older; texts are still shown old → new. */
  reversed: boolean;
  /** False when the two rule sets are not connected through `basedOn`. */
  connected: boolean;
  changes: ComparedChange[];
  assumptions: TrainingAssumption[];
  documents: DocumentDifference[];
};

const sectionKey = (section: OfficialSection) =>
  `${section.document}:${section.anchor}`;

function findSection(
  ruleset: RulesetDefinition,
  document: string,
  anchor: string | undefined,
) {
  if (!anchor) return null;
  return (
    ruleset.index.sections.find(
      (section) => section.document === document && section.anchor === anchor,
    ) ?? null
  );
}

/** Rule sets from `older` (exclusive) to `newer` (inclusive), following basedOn. */
function revisionPath(older: RulesetDefinition, newer: RulesetDefinition) {
  const path: RulesetDefinition[] = [];
  let cursor: RulesetDefinition | null = newer;
  while (cursor && cursor.id !== older.id) {
    path.unshift(cursor);
    const base: string | null = cursor.basedOn;
    cursor = base ? (RULESETS.find((item) => item.id === base) ?? null) : null;
  }
  return cursor ? path : null;
}

function compareDocuments(
  older: RulesetDefinition,
  newer: RulesetDefinition,
): DocumentDifference[] {
  const ids = [
    ...new Set([
      ...older.index.documents.map((document) => document.id),
      ...newer.index.documents.map((document) => document.id),
    ]),
  ];
  return ids.map((id) => {
    const olderDocument =
      older.index.documents.find((document) => document.id === id) ?? null;
    const newerDocument =
      newer.index.documents.find((document) => document.id === id) ?? null;
    // Repeated anchors (the scoring rubrics) are compared once, by their first use.
    const index = (ruleset: RulesetDefinition) => {
      const map = new Map<string, OfficialSection>();
      for (const section of ruleset.index.sections)
        if (section.document === id && !map.has(sectionKey(section)))
          map.set(sectionKey(section), section);
      return map;
    };
    const olderSections = index(older);
    const newerSections = index(newer);
    const sections: SectionDifference[] = [];
    for (const [key, section] of newerSections) {
      const previous = olderSections.get(key);
      if (!previous)
        sections.push({
          kind: 'added',
          document: id,
          anchor: section.anchor,
          older: null,
          newer: section,
        });
      else if (previous.number !== section.number)
        sections.push({
          kind: 'renumbered',
          document: id,
          anchor: section.anchor,
          older: previous,
          newer: section,
        });
      else if (previous.title !== section.title)
        sections.push({
          kind: 'retitled',
          document: id,
          anchor: section.anchor,
          older: previous,
          newer: section,
        });
    }
    for (const [key, section] of olderSections)
      if (!newerSections.has(key))
        sections.push({
          kind: 'removed',
          document: id,
          anchor: section.anchor,
          older: section,
          newer: null,
        });
    return {
      id,
      title: newerDocument?.title ?? olderDocument?.title ?? id,
      older: olderDocument,
      newer: newerDocument,
      contentChanged:
        olderDocument?.contentSha256 && newerDocument?.contentSha256
          ? olderDocument.contentSha256 !== newerDocument.contentSha256
          : olderDocument && newerDocument
            ? null
            : true,
      sections,
    };
  });
}

/**
 * Differences between any two registered rule sets, in either order. Curated
 * changes are collected along the chain of revisions between them; the
 * structural differences are computed from the two heading indexes, so they
 * also exist for rule sets nobody has written change notes for yet.
 */
export function compareRulesets(
  firstId: string,
  secondId: string,
): RulesetComparison {
  const first = getRuleset(firstId);
  const second = getRuleset(secondId);
  const reversed = rulesetPosition(first.id) > rulesetPosition(second.id);
  const older = reversed ? second : first;
  const newer = reversed ? first : second;
  const path = older.id === newer.id ? [] : revisionPath(older, newer);
  const steps = path ?? [];
  const changes: ComparedChange[] = steps.flatMap((ruleset) =>
    ruleset.changes.map((change) => ({
      ...change,
      step: { from: ruleset.basedOn ?? older.id, to: ruleset.id },
      olderSection: findSection(
        older,
        change.document,
        change.previousAnchor ?? change.anchor,
      ),
      newerSection: findSection(newer, change.document, change.anchor),
    })),
  );
  const assumptionIds = new Set<string>();
  const assumptions = steps
    .flatMap((ruleset) => ruleset.assumptions)
    .filter((assumption) => {
      if (assumptionIds.has(assumption.id)) return false;
      assumptionIds.add(assumption.id);
      return true;
    });
  return {
    older,
    newer,
    reversed,
    connected: path !== null,
    changes,
    assumptions,
    documents: compareDocuments(older, newer),
  };
}

export const RULE_CHANGE_AREAS = [
  { id: 'match', label: 'Match procedure' },
  { id: 'restarts', label: 'Kick-offs & restarts' },
  { id: 'penalty-area', label: 'Penalty area' },
  { id: 'out-of-bounds', label: 'Out of bounds' },
  { id: 'ball', label: 'Ball handling' },
  { id: 'robots', label: 'Robots & inspection' },
  { id: 'administration', label: 'Teams & organization' },
  { id: 'editorial', label: 'Editorial' },
] as const;

export const RULE_CHANGE_IMPACTS = [
  { id: 'referee', label: 'Changes a referee decision' },
  { id: 'teams', label: 'Teams prepare differently' },
  { id: 'organizers', label: 'Organizers prepare differently' },
  { id: 'editorial', label: 'Wording only' },
] as const;
