import type { DeepPartial, GameplayRules } from './types';
import { GAMEPLAY_2026 } from './2026/gameplay';
import { GAMEPLAY_2027 } from './2027/gameplay';

/**
 * Engine-facing view of the registry. It deliberately imports nothing but
 * plain parameter files, so the match engines (and the server-side
 * certification verifier that replays them) stay free of UI and lesson code.
 *
 * Register a season here and in ./registry.ts. Entries are ordered from the
 * oldest to the newest; each one overrides the rule set it is based on.
 */
const GAMEPLAY_CHAIN: ReadonlyArray<{
  id: string;
  basedOn: string | null;
  overrides: DeepPartial<GameplayRules>;
}> = [
  { id: '2026', basedOn: null, overrides: GAMEPLAY_2026 },
  { id: '2027', basedOn: '2026', overrides: GAMEPLAY_2027 },
];

/** Certification rounds, stored evidence and replays are graded with this rule set. */
export const CERTIFICATION_RULESET_ID = '2026';

function merge<T extends object>(base: T, overrides: DeepPartial<T>): T {
  const result = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;
    const current = result[key];
    result[key] =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === 'object'
        ? merge(current as object, value as DeepPartial<object>)
        : value;
  }
  return result as T;
}

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const entry of Object.values(value)) freeze(entry);
    Object.freeze(value);
  }
  return value;
}

const resolved = new Map<string, GameplayRules>();
for (const entry of GAMEPLAY_CHAIN) {
  const base = entry.basedOn ? resolved.get(entry.basedOn) : undefined;
  if (entry.basedOn && !base)
    throw new Error(
      `Rule set ${entry.id} is based on ${entry.basedOn}, which must be registered before it.`,
    );
  resolved.set(
    entry.id,
    freeze(
      base
        ? merge(base, entry.overrides)
        : (structuredClone(entry.overrides) as GameplayRules),
    ),
  );
}

export const GAMEPLAY_RULESET_IDS: readonly string[] = GAMEPLAY_CHAIN.map(
  (entry) => entry.id,
);

export function hasGameplayRules(id: unknown): id is string {
  return typeof id === 'string' && resolved.has(id);
}

/** Unknown ids fall back to the certification rule set rather than throwing. */
export function gameplayRulesFor(id?: string | null): GameplayRules {
  return (
    (id ? resolved.get(id) : undefined) ??
    resolved.get(CERTIFICATION_RULESET_ID)!
  );
}
