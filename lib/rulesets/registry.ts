import { RULESET_2026 } from './2026/definition';
import { RULESET_2027 } from './2027/definition';
import { CERTIFICATION_RULESET_ID, GAMEPLAY_RULESET_IDS } from './gameplay';
import type { RulesetDefinition } from './types';

/**
 * Every rule set the Lab can work with, ordered from the oldest to the newest.
 * To add a season, create its folder, add it here and in ./gameplay.ts, and
 * follow docs/adding-a-rules-version.md.
 */
export const RULESETS: readonly RulesetDefinition[] = [
  RULESET_2026,
  RULESET_2027,
];

/**
 * What a first-time visitor sees. Keep the newest FINAL rule set here; a draft
 * stays one click away in the header.
 */
export const DEFAULT_RULESET_ID = '2026';

export { CERTIFICATION_RULESET_ID };

const byId = new Map(RULESETS.map((ruleset) => [ruleset.id, ruleset]));

// Fail at start-up, not in the middle of a match, when a season was only
// registered in one of the two lists or is based on an unknown rule set.
if (
  RULESETS.length !== byId.size ||
  RULESETS.map((ruleset) => ruleset.id).join() !== GAMEPLAY_RULESET_IDS.join()
)
  throw new Error(
    'lib/rulesets/registry.ts and lib/rulesets/gameplay.ts must list the same rule sets in the same order.',
  );
RULESETS.forEach((ruleset, position) => {
  const base = ruleset.basedOn ? byId.get(ruleset.basedOn) : null;
  if (ruleset.basedOn && (!base || RULESETS.indexOf(base) >= position))
    throw new Error(
      `Rule set ${ruleset.id} must come after ${ruleset.basedOn}, the rule set it is based on.`,
    );
});
for (const id of [DEFAULT_RULESET_ID, CERTIFICATION_RULESET_ID])
  if (!byId.has(id)) throw new Error(`Rule set ${id} is not registered.`);

export function isRulesetId(value: unknown): value is string {
  return typeof value === 'string' && byId.has(value);
}

/** Unknown ids resolve to the default rule set, so stale links keep working. */
export function getRuleset(id?: string | null): RulesetDefinition {
  return (id ? byId.get(id) : undefined) ?? byId.get(DEFAULT_RULESET_ID)!;
}

export function rulesetPosition(id: string) {
  return RULESETS.findIndex((ruleset) => ruleset.id === id);
}

/** "2027 rules · draft" for selectors and headings. */
export function rulesetOptionLabel(ruleset: RulesetDefinition) {
  return ruleset.status === 'draft'
    ? `${ruleset.label} · draft`
    : ruleset.label;
}

/** The newest rule set other than `id`; the natural partner for a comparison. */
export function comparisonPartner(id: string) {
  const ruleset = getRuleset(id);
  if (ruleset.basedOn) return ruleset.basedOn;
  const newer = RULESETS.find((candidate) => candidate.basedOn === ruleset.id);
  return (
    newer?.id ??
    RULESETS.find((candidate) => candidate.id !== ruleset.id)?.id ??
    ruleset.id
  );
}
