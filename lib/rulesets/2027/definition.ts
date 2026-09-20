import index from './official-index.json';
import { gameplayRulesFor } from '../gameplay';
import type { OfficialIndex, RulesetDefinition } from '../types';
import {
  CHANGES_2027,
  SOURCE_NOTICES_2027,
  TRAINING_ASSUMPTIONS_2027,
} from './changes';

/**
 * Draft published 2026-09-18 for comment. When the committee publishes the
 * final text: re-run `python scripts/sync-rulebook.py 2027`, review
 * ./changes.ts and ./gameplay.ts against it, and set `status` to 'final'.
 */
export const RULESET_2027: RulesetDefinition = {
  id: '2027',
  season: 2027,
  title: 'RoboCupJunior Soccer Rules 2027',
  label: '2027 rules',
  shortLabel: '2027',
  status: 'draft',
  basedOn: '2026',
  index: index as OfficialIndex,
  gameplay: gameplayRulesFor('2027'),
  changes: CHANGES_2027,
  assumptions: TRAINING_ASSUMPTIONS_2027,
  sourceNotices: SOURCE_NOTICES_2027,
  soccerDocumentLabel: 'Soccer rules 2027',
  readingProgressKey: 'rcj-rulebook-read-2027-v1',
};
