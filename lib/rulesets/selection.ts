import { DEFAULT_RULESET_ID, isRulesetId } from './registry';

/** The selected rule set is device-local, like the language. */
export const RULESET_STORAGE_KEY = 'rcj-soccer-lab-ruleset-v1';
/** `?ruleset=2027` selects a rule set in shared links; `rule` is a section. */
export const RULESET_QUERY_KEY = 'ruleset';

export function safeReadRuleset(
  storage: Pick<Storage, 'getItem'> | null | undefined,
): string | null {
  try {
    const value = storage?.getItem(RULESET_STORAGE_KEY);
    return isRulesetId(value) ? value : null;
  } catch {
    return null;
  }
}

export function safeWriteRuleset(
  storage: Pick<Storage, 'setItem'> | null | undefined,
  id: string,
) {
  try {
    storage?.setItem(RULESET_STORAGE_KEY, id);
    return Boolean(storage);
  } catch {
    return false;
  }
}

/** An explicit link wins over the stored choice, which wins over the default. */
export function resolveRuleset({
  search = '',
  stored = null,
}: {
  search?: string;
  stored?: unknown;
}): string {
  const requested = new URLSearchParams(search).get(RULESET_QUERY_KEY);
  if (isRulesetId(requested)) return requested;
  return isRulesetId(stored) ? stored : DEFAULT_RULESET_ID;
}
