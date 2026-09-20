'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CERTIFICATION_RULESET_ID,
  DEFAULT_RULESET_ID,
  getRuleset,
  isRulesetId,
} from '@/lib/rulesets/registry';
import {
  RULESET_QUERY_KEY,
  resolveRuleset,
  safeReadRuleset,
  safeWriteRuleset,
} from '@/lib/rulesets/selection';
import type { RulesetDefinition } from '@/lib/rulesets/types';

type RulesetContextValue = {
  /** The rule set in force for this part of the app. */
  ruleset: RulesetDefinition;
  rulesetId: string;
  /** What the person chose in the header, even while a lock overrides it. */
  selectedId: string;
  select: (id: string) => void;
  /** Set while certification work pins the rules; explains the disabled selector. */
  lockedReason: string | null;
};

const fallback = getRuleset(DEFAULT_RULESET_ID);
const RulesetContext = createContext<RulesetContextValue>({
  ruleset: fallback,
  rulesetId: fallback.id,
  selectedId: fallback.id,
  select: () => undefined,
  lockedReason: null,
});

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Owns the selected rule set. The choice is device-local like the language,
 * and `?ruleset=` in a shared link wins over it.
 */
export function RulesetProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(DEFAULT_RULESET_ID);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restore = () =>
      setSelectedId(
        resolveRuleset({
          search: window.location.search,
          stored: safeReadRuleset(browserStorage()),
        }),
      );
    const frame = requestAnimationFrame(() => {
      restore();
      setReady(true);
    });
    window.addEventListener('popstate', restore);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', restore);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    safeWriteRuleset(browserStorage(), selectedId);
    const url = new URL(window.location.href);
    if (url.searchParams.get(RULESET_QUERY_KEY) !== selectedId) {
      url.searchParams.set(RULESET_QUERY_KEY, selectedId);
      window.history.replaceState(null, '', url);
    }
  }, [ready, selectedId]);

  const select = useCallback((id: string) => {
    if (isRulesetId(id)) setSelectedId(id);
  }, []);
  const value = useMemo<RulesetContextValue>(() => {
    const ruleset = getRuleset(selectedId);
    return {
      ruleset,
      rulesetId: ruleset.id,
      selectedId: ruleset.id,
      select,
      lockedReason: null,
    };
  }, [select, selectedId]);
  return (
    <RulesetContext.Provider value={value}>{children}</RulesetContext.Provider>
  );
}

/**
 * Pins a subtree to one rule set regardless of the header selection.
 * Certification rounds, their games and their saved replays are assigned and
 * verified under the certification rule set.
 */
export function RulesetScope({
  rulesetId,
  reason,
  children,
}: {
  rulesetId: string | null;
  reason?: string;
  children: ReactNode;
}) {
  const parent = useContext(RulesetContext);
  const value = useMemo<RulesetContextValue>(() => {
    if (!rulesetId) return parent;
    const ruleset = getRuleset(rulesetId);
    return {
      ...parent,
      ruleset,
      rulesetId: ruleset.id,
      lockedReason: reason ?? null,
    };
  }, [parent, reason, rulesetId]);
  return (
    <RulesetContext.Provider value={value}>{children}</RulesetContext.Provider>
  );
}

export function useRuleset() {
  return useContext(RulesetContext);
}

export const CERTIFICATION_RULESET_LOCK = `Certification uses the ${getRuleset(CERTIFICATION_RULESET_ID).label}.`;
