import type { DeepPartial, GameplayRules } from '../types';

/**
 * What the 2027 draft (revision 2026-09-18) changes for the match engines,
 * relative to 2026. Every value follows the draft's own change list.
 *
 * Three values rest on a documented training assumption because the draft
 * leaves the point open; each is a one-line switch here:
 * - pushing.lineDepth: the draft announces the line but not its position;
 * - outOfBounds.kickoffEndsPenaltyEarly: section 2.8 makes the minute a
 *   minimum while section 2.3 still lets out-of-bounds robots return before
 *   a kick-off;
 * - outOfBounds.returnPlacement: "the general area of its own corner" names
 *   neither which own-half corner nor an orientation.
 * See TRAINING_ASSUMPTIONS_2027 in ./definition.ts.
 */
export const GAMEPLAY_2027: DeepPartial<GameplayRules> = {
  outOfBounds: {
    kickoffEndsPenaltyEarly: false,
    returnNeedsInterruption: true,
    returnPlacement: 'own-corner',
    voidGoals: 'penalized-robot',
    pushedOntoRampWaivable: true,
  },
  multipleDefense: { areas: 'own' },
  pushing: {
    basis: 'line',
    // Placeholder: mid-depth of the 25 cm penalty area. Replace with the
    // published dimension and set lineProvisional to false.
    lineDepth: 0.125,
    lineProvisional: true,
  },
  holding: { consequence: 'damaged' },
  lackOfProgress: { returnServedRobotsFirst: true },
  kickoff: { neutralWhenAllRobotsOut: true },
  lateTeam: { automaticLossAtGoals: 10 },
  kickerTest: { procedure: 'vertical-height', maximumHeight: 1 },
};
