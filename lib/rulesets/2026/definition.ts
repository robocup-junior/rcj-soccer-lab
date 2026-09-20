import index from './official-index.json';
import { gameplayRulesFor } from '../gameplay';
import type { OfficialIndex, RulesetDefinition } from '../types';

export const RULESET_2026: RulesetDefinition = {
  id: '2026',
  season: 2026,
  title: 'RoboCupJunior Soccer Rules 2026',
  label: '2026 rules',
  shortLabel: '2026',
  status: 'final',
  basedOn: null,
  index: index as OfficialIndex,
  gameplay: gameplayRulesFor('2026'),
  changes: [],
  assumptions: [],
  sourceNotices: [],
  soccerDocumentLabel: 'Soccer rules 2026',
  // Unchanged from the single-version app so existing reading progress survives.
  readingProgressKey: 'rcj-rulebook-read-2026-06-03-v1',
};
