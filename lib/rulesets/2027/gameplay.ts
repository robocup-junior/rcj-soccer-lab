import type { DeepPartial, GameplayRules } from '../types';

/**
 * What the 2027 draft (revision 2026-09-24) changes for the match engines,
 * relative to 2026. Every value follows the draft's own change list.
 *
 * Three values rest on a documented training assumption because the draft
 * leaves the point open; each is a one-line switch here:
 * - pushing.lineDepth: the draft announces the line but not its position;
 * - outOfBounds.kickoffEndsPenaltyEarly: section 2.8 makes the minute a
 *   minimum while section 2.3 still lets out-of-bounds robots return before
 *   a kick-off;
 * - outOfBounds.returnPlacement: "the general area of its own corner" names
 *   neither which own-half corner nor an exact position.
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
    // Committee-requested visual placeholder: translate the curved white
    // centreline 16 cm towards the goal. Not a published field dimension.
    lineDepth: 0.16,
    lineProvisional: true,
  },
  holding: { consequence: 'damaged' },
  lackOfProgress: { returnServedRobotsFirst: true },
  kickoff: { neutralWhenAllRobotsOut: true },
  lateTeam: { automaticLossAtGoals: 10 },
  kickerTest: { procedure: 'vertical-height', maximumHeight: 1 },
};
