import type { GameplayRules } from '../types';

/**
 * RoboCupJunior Soccer Rules 2026 (revision 2026-06-03) as adjudicated by the
 * simulator. Certification evidence is graded against exactly these values;
 * do not edit them. A later season overrides them in its own folder.
 */
export const GAMEPLAY_2026: GameplayRules = {
  outOfBounds: {
    penaltySeconds: 60,
    kickoffEndsPenaltyEarly: true,
    returnNeedsInterruption: false,
    returnPlacement: 'furthest-neutral-spot',
    voidGoals: 'penalized-team',
    pushedOntoRampWaivable: false,
  },
  multipleDefense: { areas: 'any' },
  pushing: { basis: 'discretion', lineDepth: null, lineProvisional: false },
  holding: { consequence: 'inspect' },
  lackOfProgress: { returnServedRobotsFirst: false },
  kickoff: { neutralWhenAllRobotsOut: false },
  lateTeam: { automaticLossAtGoals: null },
  kickerTest: { procedure: 'goal-rebound', maximumHeight: null },
};
