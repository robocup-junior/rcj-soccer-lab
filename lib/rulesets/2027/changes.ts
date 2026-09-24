import type { RuleChange, SourceNotice, TrainingAssumption } from '../types';

/**
 * Where the 2027 draft leaves a point open, the trainer states what it does.
 * These are exercise conventions, not amendments to the published rules; each
 * corresponds to one switch in ./gameplay.ts.
 */
export const TRAINING_ASSUMPTIONS_2027: readonly TrainingAssumption[] = [
  {
    id: 'pushing-line-position',
    title: 'Position of the pushing line',
    question:
      'The draft announces the pushing line for an updated field specification but does not give its position yet.',
    choice:
      'The Lab copies the curved white penalty-area centreline 16 cm towards the goal, clipped at the goal line. This is a provisional simulation setting, not a published field dimension.',
    anchors: ['inside-penalty-area'],
  },
  {
    id: 'kickoff-return-conflict',
    title: 'Out-of-bounds robots at a kick-off',
    question:
      'Section 2.8 now makes the minute a minimum, while section 2.3 still lets out-of-bounds robots return before a kick-off as soon as they are ready.',
    choice:
      'The trainer follows the changed section 2.8: an out-of-bounds robot serves its full minute, and a kick-off after that minute brings it back. Damaged robots keep their kick-off exception from section 2.9.',
    anchors: ['out-of-bounds', 'kick-off'],
  },
  {
    id: 'game-interruptions',
    title: 'What counts as a game interruption',
    question:
      'For the return of out-of-bounds robots the draft lists kick-off, lack of progress and pushing, followed by “etc.”.',
    choice:
      'The trainer also counts referee stoppages and retrieving a ball that left the field. Removing or relocating a robot alone does not count.',
    anchors: ['out-of-bounds'],
  },
  {
    id: 'own-corner',
    title: 'Which own corner',
    question:
      'The draft allows either own corner, clear of the white lines and facing its own goal. It does not specify an exact position or which corner to use.',
    choice:
      'The simulator chooses the free own-half corner farther from the ball, clear of white lines, and faces the robot towards its own goal.',
    anchors: ['out-of-bounds'],
  },
];

/** Changes from the 2026 rules (2026-06-03) to the 2027 draft (2026-09-24). */
export const CHANGES_2027: readonly RuleChange[] = [
  {
    id: 'late-team',
    document: 'soccer',
    anchor: 'game-procedure-and-length-of-a-game',
    kind: 'changed',
    area: 'match',
    impact: 'referee',
    title: 'Late teams: a definition, and an automatic loss at 10–0',
    before:
      'A team that is late for the start may be penalized one goal per 30 seconds at the referee’s discretion. The rules do not say when a team counts as late or when the penalty ends.',
    after:
      'A team is late when it does not show up with at least one working robot. The discretionary penalty of one goal per 30 seconds stays, and once it reaches 10–0 the late team automatically loses the game.',
    effect:
      'One working robot is enough to start. Stop adding goals at 10–0 and record the loss.',
    simulator:
      'The time before a match is not simulated. The Rules tab has a 2027 question on the new limit.',
    practice: ['question:late-team-loss-2027'],
  },
  {
    id: 'neutral-kickoff-all-out',
    document: 'soccer',
    anchor: 'neutral-kickoff',
    kind: 'added',
    area: 'restarts',
    impact: 'referee',
    title: 'Neutral kick-off when every robot is off the field',
    before:
      'A neutral kick-off is only named as a possible restart after the referee has stopped the game.',
    after:
      'A neutral kick-off also takes place when all robots of both teams are out of the field.',
    effect:
      'With no robot left on the field, do not wait for a lack-of-progress count. Prepare a neutral kick-off and bring back the robots that may return.',
    simulator:
      'Referee mode raises the situation when the last robot leaves and expects the Neutral kickoff call. The kick-off then waits until each team has a robot that may return.',
    practice: ['case:all-out-2027', 'question:neutral-all-out-2027'],
  },
  {
    id: 'holding-damaged',
    document: 'soccer',
    anchor: 'ball-movement',
    kind: 'added',
    area: 'ball',
    impact: 'referee',
    title: 'Ball holding during play makes the robot damaged',
    before:
      'Holding the ball is forbidden, but the rules prescribe no consequence during a game. The referee has the mechanism inspected.',
    after:
      'A robot that holds the ball during gameplay is deemed damaged and loses its inspection sticker until it complies with the rule again.',
    effect:
      'Remove the robot as damaged. Before it returns it needs a new inspection, not only the waiting time.',
    simulator:
      'The Holding call removes the robot as damaged. It may return after the waiting time and a simulated re-inspection.',
    practice: [
      'case:holding-2027',
      'clip:trapped-ball-2027',
      'question:holding-damaged-2027',
    ],
  },
  {
    id: 'multiple-defense-own-area',
    document: 'soccer',
    anchor: 'inside-penalty-area',
    kind: 'changed',
    area: 'penalty-area',
    impact: 'referee',
    title: 'Multiple defense only in a team’s own penalty area',
    before:
      'Two robots of one team partly inside a penalty area are multiple defense, whichever penalty area it is.',
    after:
      'Only two robots partly inside their own penalty area are multiple defense.',
    effect:
      'Two attackers partly inside the opponent’s penalty area are no longer relocated. A robot fully inside any penalty area is still out of bounds.',
    simulator:
      'The trainer checks each team only at the goal it defends, whichever end that is after the coin toss.',
    practice: ['case:attackers-area-2027', 'question:own-area-defense-2027'],
  },
  {
    id: 'pushing-line',
    document: 'soccer',
    anchor: 'inside-penalty-area',
    kind: 'changed',
    area: 'penalty-area',
    impact: 'referee',
    title: 'Pushing is decided by a pushing line, not by discretion',
    before:
      'Contact between an attacker and a defender, with one of them partly inside the penalty area and one of them touching the ball, may be called pushing at the referee’s discretion.',
    after:
      'Robot-to-robot or robot-ball-robot contact in which the defender reaches the pushing line is pushing. The line is an extra black line inside the penalty area; its position is announced for an updated field specification.',
    effect:
      'Watch the defender rather than the force of the contact. Once it reaches the line during contact, move the ball to the furthest unoccupied neutral spot. Contact short of the line is not pushing.',
    simulator:
      'The field shows a provisional pushing line, and the trainer requires the call when the defender’s body reaches it during contact.',
    assumptions: ['pushing-line-position'],
    practice: [
      'case:pushing-line-2027',
      'case:pushing-short-2027',
      'clip:pushing-line-2027',
      'question:pushing-line-2027',
    ],
  },
  {
    id: 'lack-of-progress-return-first',
    document: 'soccer',
    anchor: 'lack-of-progress',
    kind: 'added',
    area: 'restarts',
    impact: 'referee',
    title: 'Lack of progress: return waiting robots before moving the ball',
    before:
      'After the count, the referee moves the ball to the nearest unoccupied neutral spot.',
    after:
      'If robots are out of bounds and their penalty time has passed, the referee returns them first and leaves the ball. Only if that does not resolve the lack of progress is the ball moved as before.',
    effect: 'Check the bench before touching the ball.',
    simulator:
      'After the count, return eligible robots first. If play is still stuck, move the ball to the nearest free neutral spot without starting another count.',
    practice: [
      'case:progress-return-first-2027',
      'question:progress-return-first-2027',
    ],
  },
  {
    id: 'out-of-bounds-minimum',
    document: 'soccer',
    anchor: 'out-of-bounds',
    kind: 'changed',
    area: 'out-of-bounds',
    impact: 'referee',
    title: 'Out of bounds: at least one minute, then back at an interruption',
    before:
      'The robot is removed for one minute and may return earlier if a kick-off occurs before the minute has elapsed.',
    after:
      'The robot is removed for a minimum of one minute. After that minute it returns at the next game interruption, for example a kick-off, a lack-of-progress call or a pushing call.',
    effect:
      'A kick-off no longer shortens the penalty, and an elapsed minute alone no longer brings the robot back while play is running.',
    simulator:
      'The bench shows the minute and then waits for an interruption. Kick-offs, lack-of-progress and pushing calls, retrieving a ball that left the field and referee stoppages count.',
    assumptions: ['kickoff-return-conflict', 'game-interruptions'],
    practice: [
      'case:out-return-kickoff-2027',
      'case:out-return-running-2027',
      'question:out-minimum-2027',
      'question:out-interruption-2027',
    ],
  },
  {
    id: 'out-of-bounds-goals',
    document: 'soccer',
    anchor: 'out-of-bounds',
    kind: 'changed',
    area: 'out-of-bounds',
    impact: 'referee',
    title: 'Penalized robot: goals for its team are void; own goals count',
    before:
      'No goal of the penalized team is granted while its penalized robot is still on the field.',
    after:
      'A goal scored by the penalized robot is not granted. A goal by its teammate counts, and an own goal by the penalized robot counts for the opponent.',
    effect: 'Identify which robot scored before you disallow a goal.',
    simulator:
      'The trainer treats the last robot that touched the ball as the scorer.',
    practice: [
      'case:out-goal-teammate-2027',
      'case:out-goal-scorer-2027',
      'question:out-goal-teammate-2027',
      'question:out-own-goal-2027',
    ],
  },
  {
    id: 'out-of-bounds-corner',
    document: 'soccer',
    anchor: 'out-of-bounds',
    kind: 'changed',
    area: 'out-of-bounds',
    impact: 'referee',
    title: 'Out-of-bounds robots return in their own corner',
    before:
      'After the penalty the robot is placed on the unoccupied neutral spot furthest from the ball, facing its own goal.',
    after:
      'After the penalty the robot returns near either own corner, without touching white lines and facing its own goal. Repaired damaged robots still use the furthest unoccupied neutral spot.',
    effect:
      'No neutral-spot search for an out-of-bounds return. Keep it for damaged robots.',
    simulator:
      'The robot is placed in the free own-half corner farther from the ball.',
    assumptions: ['own-corner'],
    practice: ['clip:wall-touch-2027', 'question:out-corner-2027'],
  },
  {
    id: 'pushed-onto-ramp',
    document: 'soccer',
    anchor: 'out-of-bounds',
    kind: 'added',
    area: 'out-of-bounds',
    impact: 'referee',
    title: 'Pushed out also covers being pushed onto the ramp',
    before:
      'When an opponent accidentally pushes a robot out of bounds, the referee may waive the penalty, call pushed out and move the robot slightly back onto the field.',
    after:
      'The same applies when an opponent pushes a robot onto the ramp, the wedge along the walls.',
    effect:
      'You may call pushed out and move the robot back before it reaches the wall.',
    simulator:
      'In a running match, a robot driven onto the wedge by an opponent raises an optional Pushed out decision. Leaving it is not scored as a missed call.',
    practice: ['case:pushed-ramp-2027', 'clip:pushed-ramp-2027'],
  },
  {
    id: 'kicker-vertical-test',
    document: 'soccer',
    anchor: 'kicker-power-measuring',
    kind: 'changed',
    area: 'robots',
    impact: 'teams',
    title: 'Kicker power: a vertical test is piloted',
    before:
      'On-field test: the robot kicks from inside one goal at the opposite goal. It passes if the rebound does not reach the back wall of the goal it kicked from.',
    after:
      'Pilot for the 2027 season: the robot lies on its back, the ball is placed in the ball-capturing zone and kicked straight up. It passes if the ball does not rise above 100 cm.',
    effect:
      'The result no longer depends on how the goals of a particular field rebound. Teams can check it beside a wall with a measuring tape.',
    simulator:
      'The kicker test bench in the Rules tab shows the vertical test.',
    practice: [
      'question:kicker-vertical-setup-2027',
      'question:kicker-vertical-result-2027',
    ],
  },
  {
    id: 'team-size-note',
    document: 'soccer',
    anchor: '_preface',
    kind: 'changed',
    area: 'administration',
    impact: 'teams',
    title: 'Team size note reworded',
    before:
      'A maximum of four team members was confirmed for the 2026 international competition, with five recommended wherever organizers can accommodate it.',
    after:
      'International competitions can guarantee a team size of four; a team size of five cannot be guaranteed. Five remains the recommendation for events that can accommodate it.',
  },
  {
    id: 'infrared-ball-heading',
    document: 'soccer',
    anchor: 'infrared-ball-change',
    kind: 'changed',
    area: 'editorial',
    impact: 'editorial',
    title: 'Infrared ball section retitled',
    before:
      'Section 3.8 is titled for the 2026 ball change and says the new ball is used starting this year.',
    after:
      'The title now reads “2026 and beyond”. The 42 mm infrared ball stays in use for the main league.',
  },
  {
    id: 'change-marks',
    document: 'soccer',
    anchor: '_changes_from_the_2026_robocupjunior_soccer_rules',
    previousAnchor: '_changes_from_the_2025_robocupjunior_soccer_rules',
    kind: 'changed',
    area: 'editorial',
    impact: 'editorial',
    title: 'Change marks start again from 2026',
    before:
      'Red text and the list of changes in the document mark what changed from 2025 to 2026.',
    after:
      'The earlier marks are gone. Red text and the list of changes now mark only what changed from 2026 to 2027.',
  },
];

/**
 * Temporary notes about the published pages. Delete an entry once the page is
 * corrected and the index has been re-synchronised from it.
 */
export const SOURCE_NOTICES_2027: readonly SourceNotice[] = [
  {
    id: 'provisional-pushing-line',
    document: 'soccer',
    anchors: ['inside-penalty-area'],
    text: 'The pushing-line implementation may change. Do not draw it on real fields yet. The Lab’s 16 cm curved offset is a provisional simulation setting.',
  },
];
