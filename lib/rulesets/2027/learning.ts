import {
  RULE_CLIPS,
  makeClip,
  pose,
  type Keyframe,
  type RuleClip,
} from '../../rulebook/animations';
import type { LearningOverlay } from '../../rulebook/overlay-types';
import type { RuleQuestion } from '../../rulebook/questions';
import type { RefereeCase } from '../../simulator/referee-cases';
import {
  RCJ_FIELD_DERIVED as FIELD,
  RCJ_FIELD_SPEC_2026 as SPEC,
} from '../../simulator/field-spec';
import { GAMEPLAY_2027 } from './gameplay';

/**
 * Lessons of the 2027 draft, as differences from the 2026 bank.
 *
 * Ids added here end in -2027: learning progress and shared links are stored
 * by id, so an id must never mean two different answers in two rule sets.
 */

const B = 'blue-1';
const B2 = 'blue-2';
const Y = 'yellow-1';
const Y2 = 'yellow-2';
const P = Math.PI;

const baseClip = (id: string) => RULE_CLIPS.find((clip) => clip.id === id)!;
const relabel = (
  frames: Keyframe[],
  changes: Record<number, Partial<Keyframe>>,
): Keyframe[] =>
  frames.map((frame, index) => ({ ...frame, ...changes[index] }));

// Blue defends the goal at negative z in every authored scene.
const LINE_DEPTH = GAMEPLAY_2027.pushing?.lineDepth ?? 0.125;
const AREA_FRONT =
  FIELD.penaltyBackEdgeZ - SPEC.penaltyArea.depth; /* outer front edge */
/** Defender centre whose 85 mm chassis is 30 mm past the pushing line. */
const DEFENDER_AT_LINE = -(AREA_FRONT + LINE_DEPTH - 0.085 + 0.03);
/** Defender centre whose chassis is still 25 mm short of the line. */
const DEFENDER_SHORT = -(AREA_FRONT + LINE_DEPTH - 0.085 - 0.025);
const TOUCH = 0.122; // robot centre to ball centre while touching
const OWN_CORNER = pose(
  FIELD.playingHalfWidth - 0.2,
  -(FIELD.playingHalfLength - 0.2),
  Math.atan2(-(FIELD.playingHalfWidth - 0.2), FIELD.playingHalfLength - 0.2),
);

const CLIPS_2027: RuleClip[] = [
  makeClip(
    'pushing-line-2027',
    'Contact at the pushing line',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'Yellow approaches the ball in front of the defender',
        poses: {
          [B]: pose(0, DEFENDER_SHORT),
          [B2]: pose(0.6, 0.2),
          [Y]: pose(0.22, DEFENDER_SHORT + 2 * TOUCH + 0.3, P),
          [Y2]: pose(-0.5, 0.5, P),
          ball: pose(0, DEFENDER_SHORT + TOUCH),
        },
      },
      {
        at: 2.5,
        label: 'Robot-ball-robot contact, short of the line',
        poses: { [Y]: pose(0, DEFENDER_SHORT + 2 * TOUCH, P) },
        readout: 'Defender has not reached the line',
      },
      {
        at: 4,
        label: 'Yellow keeps driving: the defender reaches the line',
        poses: {
          [B]: pose(0, DEFENDER_AT_LINE),
          [Y]: pose(0, DEFENDER_AT_LINE + 2 * TOUCH, P),
          ball: pose(0, DEFENDER_AT_LINE + TOUCH),
        },
        readout: 'Pushing · provisional line position',
        focus: B,
      },
      {
        at: 6,
        label: 'Referee moves the ball to the far spot',
        poses: { ball: pose(FIELD.neutralSpotX, FIELD.neutralSpotZ) },
        readout: 'Furthest unoccupied neutral spot',
      },
    ],
    'Yellow pushes the ball and the Blue defender back until the defender reaches the pushing line. What do you call under the 2027 draft?',
    [
      'Pushing: move the ball to the furthest unoccupied neutral spot',
      'Play on: pushing needs direct robot-to-robot contact',
      'Pushing only if you judge the contact to be too hard',
    ],
    0,
    'In the 2027 draft, robot-to-robot or robot-ball-robot contact in which the defender reaches the pushing line is pushing. The call no longer depends on discretion. The line position shown here is provisional.',
  ),
  {
    ...baseClip('contact-midfield'),
    id: 'contact-midfield-2027',
    frames: relabel(baseClip('contact-midfield').frames, {
      0: { label: 'The same approach at midfield' },
      1: {
        label: 'Contact far from both penalty areas',
        readout: 'No defender at a pushing line',
      },
    }),
    question:
      'The opponents touch each other and the ball at midfield. Is this pushing under the 2027 draft?',
    options: [
      'Yes; opponent contact with the ball is enough anywhere',
      'No; no defender has reached a pushing line',
    ],
    answer: 1,
    feedback:
      'The 2027 pushing rule depends on the defender reaching the pushing line inside its penalty area. Midfield contact cannot meet that condition; assess other infringements separately.',
  },
  makeClip(
    'attackers-area-2027',
    'Two attackers in the opponent’s area',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'Yellow attacks the goal Blue defends',
        poses: {
          [B]: pose(0, -0.87),
          [B2]: pose(0.5, 0.3),
          [Y]: pose(-0.2, -0.5, P),
          [Y2]: pose(0.25, -0.45, P),
          ball: pose(-0.2, -0.5 - TOUCH),
        },
      },
      {
        at: 2.5,
        label: 'Both Yellow robots partly overlap Blue’s penalty area',
        poses: {
          [Y]: pose(-0.2, -0.76, P),
          [Y2]: pose(0.25, -0.76, P),
          ball: pose(-0.2, -0.76 - TOUCH),
        },
        readout: 'Not their own penalty area',
      },
      {
        at: 5,
        label: 'No relocation · play continues',
        poses: { [Y2]: pose(0.3, -0.58, P) },
      },
    ],
    'Two Yellow attackers partly overlap the penalty area of the goal Blue defends. Is this multiple defense under the 2027 draft?',
    [
      'Yes; relocate the Yellow robot farther from the ball',
      'No; multiple defense applies only in a team’s own penalty area',
    ],
    1,
    'The 2027 draft limits multiple defense to two robots partly inside their own penalty area. Attackers are not relocated; a robot fully inside any penalty area is still out of bounds.',
  ),
  {
    ...baseClip('trapped-ball'),
    id: 'trapped-ball-2027',
    frames: relabel(baseClip('trapped-ball').frames, {
      3: { label: 'Blue 1 leaves the field as damaged', poses: { [B]: null } },
    }),
    question:
      'The ball stays fixed to Blue 1 while it moves, and Yellow cannot free it. What follows under the 2027 draft?',
    options: [
      'Blue 1 is deemed damaged and loses its inspection sticker until it complies',
      'Play continues; the mechanism is checked after the game',
    ],
    answer: 0,
    feedback:
      'A ball fixed to the moving robot and inaccessible to opponents is holding, not the backspin-dribbler exception. During gameplay the 2027 draft deems the robot damaged; it needs a compliant mechanism and a new inspection before it returns.',
  },
  makeClip(
    'wall-touch-2027',
    'A robot touches the wall',
    'out-of-bounds',
    [
      ...baseClip('wall-touch').frames.slice(0, 2),
      {
        at: 3,
        label: 'Robot removed · penalty starts',
        poses: { [B]: null },
        readout: 'At least 60 s · match continues',
      },
      {
        at: 4.5,
        label: 'Minute served · waiting for an interruption',
        readout: 'Play is still running',
      },
      {
        at: 6,
        label: 'Interruption: the robot returns in its own corner',
        poses: { [B]: OWN_CORNER },
        readout: 'Own corner area · time compressed',
      },
    ],
    'Blue 1 touches the physical wall without being pushed by an opponent. What should you call?',
    [
      'Out of bounds: remove Blue 1 for at least one minute',
      'Play on: only leaving the enclosure counts as out of bounds',
    ],
    0,
    'Wall contact is out of bounds. In the 2027 draft the minute is a minimum: the match clock continues, and after the minute the robot returns at the next game interruption, in the area of its own corner.',
  ),
  makeClip(
    'pushed-ramp-2027',
    'An opponent pushes a robot onto the ramp',
    'out-of-bounds',
    [
      {
        at: 0,
        label: 'Opponents near the side wall',
        poses: {
          [B]: pose(0.6, 0, -P / 2),
          [Y]: pose(0.4, 0, P / 2),
          ball: pose(-0.5, 0.4),
        },
      },
      {
        at: 2.5,
        label: 'Yellow drives Blue 1 onto the ramp',
        poses: { [B]: pose(0.77, 0, -P / 2), [Y]: pose(0.57, 0, P / 2) },
        readout: 'On the ramp · no wall contact',
        focus: B,
      },
      {
        at: 5,
        label: 'Example: pushed out called, small correction',
        poses: { [B]: pose(0.62, 0.06, -P / 2), [Y]: pose(0.4, 0, P / 2) },
      },
    ],
    'Yellow pushes Blue 1 onto the ramp along the wall; Blue 1 has not touched the wall. What may you do under the 2027 draft?',
    [
      'Call pushed out and move Blue 1 slightly back onto the field',
      'Nothing; you may only act once Blue 1 touches the wall',
      'Remove Blue 1 for one minute',
    ],
    0,
    'The 2027 draft extends pushed out to a robot that an opponent pushes onto the ramp. The referee may call it and move the robot slightly back; no penalty is involved.',
  ),
  makeClip(
    'out-scorer-2027',
    'The penalized robot scores',
    'out-of-bounds',
    [
      {
        at: 0,
        label: 'Blue 1 drifts towards the side wall',
        poses: {
          [B]: pose(0.6, 0.3, P / 2),
          [B2]: pose(-0.3, -0.5),
          [Y]: pose(-0.6, 0.5, P),
          [Y2]: pose(-0.45, 0.8, P),
          ball: pose(0.3, 0.55),
        },
      },
      {
        at: 1.5,
        label: 'Wall contact',
        poses: { [B]: pose(0.81, 0.3, P / 2) },
        readout: 'Out of bounds · not yet removed',
        focus: B,
      },
      {
        at: 3,
        label: 'Blue 1 drives back to the ball',
        poses: { [B]: pose(0.3, 0.55 - TOUCH, 0) },
      },
      {
        at: 4,
        label: 'Blue 1 shoots',
        poses: { ball: pose(0.12, 1.098) },
        readout: 'Shot by the penalized robot',
      },
      {
        at: 5,
        label: 'Back-wall contact',
        poses: { ball: pose(0.1, FIELD.goalBackContactBallCenterZ) },
        readout: 'Goal not granted',
      },
      {
        at: 6.5,
        label: 'Blue 1 removed · penalty starts',
        poses: { [B]: null },
      },
    ],
    'Blue 1 touched the wall, was not removed, and then scores itself. What do you decide under the 2027 draft?',
    [
      'The goal counts, because Blue 1 was still on the field',
      'No goal; remove Blue 1 for its out-of-bounds penalty',
    ],
    1,
    'A goal scored by the penalized robot is not granted. A goal by its teammate would count, and an own goal by the penalized robot would count for the opponent.',
  ),
];

/** Replayed by the combined drill only; the order lesson keeps its 2026 clip. */
const SCENE_CLIPS_2027: RuleClip[] = [
  makeClip(
    'combined-line-2027',
    'Pushing at the line and two defenders',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'Yellow attacks; Blue 2 drops back',
        poses: {
          [B]: pose(-0.1, DEFENDER_SHORT),
          [B2]: pose(0.22, -0.62),
          [Y]: pose(0.1, DEFENDER_SHORT + 2 * TOUCH + 0.25, P),
          [Y2]: pose(-0.5, 0.5, P),
          ball: pose(-0.1, DEFENDER_SHORT + TOUCH),
        },
      },
      {
        at: 2.5,
        label: 'Defender at the pushing line; second defender in the area',
        poses: {
          [B]: pose(-0.1, DEFENDER_AT_LINE),
          [B2]: pose(0.22, -0.87),
          [Y]: pose(-0.1, DEFENDER_AT_LINE + 2 * TOUCH, P),
          ball: pose(-0.1, DEFENDER_AT_LINE + TOUCH),
        },
        readout: 'Two overlapping events',
      },
      {
        at: 4,
        label: 'Resolve pushing first',
        poses: { ball: pose(FIELD.neutralSpotX, FIELD.neutralSpotZ) },
        readout: '1 · BALL placement',
      },
      {
        at: 6,
        label: 'Then resolve multiple defense',
        poses: { [B]: pose(-FIELD.neutralSpotX, -FIELD.neutralSpotZ, P) },
        readout: '2 · ROBOT placement, distances reassessed',
      },
    ],
    'The defender has reached the pushing line and two Blue robots partly overlap their own penalty area. Which correction comes first?',
    [
      'Move the farther Blue defender, then relocate the ball',
      'Resolve pushing by relocating the ball, then reassess multiple defense',
    ],
    1,
    'Resolve pushing first. After moving the ball, reassess which defender is farther from its new position before resolving multiple defense.',
  ),
];

const QUESTIONS_2027: RuleQuestion[] = [
  {
    id: 'late-team-loss-2027',
    title: 'Late team: the 10–0 limit',
    anchor: 'game-procedure-and-length-of-a-game',
    question:
      'Yellow has not appeared with a working robot, and the referee has been adding one goal per 30 seconds. What happens when the penalty reaches 10–0 under the 2027 draft?',
    options: [
      'The referee keeps adding goals until Yellow arrives',
      'Yellow automatically loses the game',
      'The game is cancelled and recorded 0–0',
    ],
    answer: 1,
    feedback:
      'The 2027 draft ends the late-arrival penalty at 10–0 with an automatic loss. A team counts as late when it does not show up with at least one working robot; awarding the goals remains at the referee’s discretion.',
  },
  {
    id: 'neutral-all-out-2027',
    title: 'Nobody left on the field',
    anchor: 'neutral-kickoff',
    question:
      'All four robots have been removed and nobody is left on the field. How does play continue under the 2027 draft?',
    options: [
      'With a neutral kick-off',
      'The ball stays where it is until a robot returns',
      'With a kick-off for the team that lost its last robot later',
    ],
    answer: 0,
    feedback:
      'The 2027 draft adds this case to the neutral kick-off. Robots come back for it as soon as they are allowed to return.',
  },
  {
    id: 'holding-damaged-2027',
    title: 'Consequence of ball holding',
    anchor: 'ball-movement',
    question:
      'During a game, a robot traps the ball so that it cannot roll and opponents cannot reach it. What does the 2027 draft prescribe?',
    options: [
      'A warning; the mechanism is checked at the next daily inspection',
      'A one-minute out-of-bounds penalty',
      'The robot is deemed damaged and loses its inspection sticker until it complies',
    ],
    answer: 2,
    feedback:
      'Holding during gameplay now has a stated consequence. The robot leaves as damaged and needs a compliant mechanism and a new inspection before it may return. A rotating dribbler that leaves the ball accessible is still allowed.',
  },
  {
    id: 'own-area-defense-2027',
    title: 'Multiple defense: whose penalty area?',
    anchor: 'inside-penalty-area',
    question:
      'Two Yellow robots partly overlap the penalty area of the goal they are attacking. Neither is fully inside. What applies under the 2027 draft?',
    options: [
      'Multiple defense: move the Yellow robot farther from the ball',
      'Nothing; multiple defense only concerns a team’s own penalty area',
      'Both Yellow robots are out of bounds',
    ],
    answer: 1,
    feedback:
      'The 2027 draft adds “their own” to the multiple-defense rule. Attackers partly inside the opponent’s area are not relocated. Full entry into any penalty area is still out of bounds.',
  },
  {
    id: 'pushing-line-2027',
    title: 'What makes contact pushing',
    anchor: 'inside-penalty-area',
    question:
      'What makes contact in the penalty area pushing under the 2027 draft?',
    options: [
      'The defender reaches the pushing line during robot-to-robot or robot-ball-robot contact',
      'The referee judges the contact to be too hard',
      'Any contact between opponents while one of them touches the ball',
    ],
    answer: 0,
    feedback:
      'The discretionary wording is replaced by an objective test: contact, directly or through the ball, in which the defender reaches the pushing line. The consequence is unchanged: the ball goes to the furthest unoccupied neutral spot, and a resulting goal is not granted.',
  },
  {
    id: 'pushing-line-position-2027',
    title: 'Where the pushing line is',
    anchor: 'inside-penalty-area',
    question: 'What does the 2027 draft say about the pushing line itself?',
    options: [
      'It is the front edge of the penalty area',
      'It is an extra black line inside the penalty area; its position follows in an updated field specification',
      'It is the goal line between the posts',
    ],
    answer: 1,
    feedback:
      'The draft describes an extra black line inside the penalty area and announces its position for an updated field specification. The line drawn in this Lab is a provisional placeholder.',
  },
  {
    id: 'progress-return-first-2027',
    title: 'Lack of progress with a robot waiting',
    anchor: 'lack-of-progress',
    question:
      'You have counted and the ball is still stuck. Blue 2 was called out of bounds 80 seconds ago and is waiting. What do you do first under the 2027 draft?',
    options: [
      'Move the ball to the nearest unoccupied neutral spot, then return Blue 2',
      'Return Blue 2 and leave the ball; move the ball only if that does not resolve it',
      'Keep Blue 2 off until the next kick-off',
    ],
    answer: 1,
    feedback:
      'Waiting robots whose penalty time has passed come back before the ball is moved. If the lack of progress continues, the usual placement on the nearest unoccupied neutral spot follows.',
  },
  {
    id: 'out-minimum-2027',
    title: 'Out of bounds: a kick-off before the minute',
    anchor: 'out-of-bounds',
    question:
      'Blue 1 was called out of bounds 25 seconds ago. Yellow scores and a kick-off is due. May Blue 1 return for it under the 2027 draft?',
    options: [
      'Yes; a kick-off ends the penalty early',
      'No; the minute is now a minimum',
      'Only if Blue has no other robot on the field',
    ],
    answer: 1,
    feedback:
      'Section 2.8 of the draft makes one minute the minimum and lets the robot return at an interruption after that minute. Section 2.3 still carries the older sentence about returning before a kick-off; this trainer follows the changed section 2.8 and marks that as a training assumption.',
  },
  {
    id: 'out-interruption-2027',
    title: 'Out of bounds: the minute has passed',
    anchor: 'out-of-bounds',
    question:
      'Blue 1 has been off for 70 seconds after an out-of-bounds call, and play is running normally. When does it return under the 2027 draft?',
    options: [
      'Immediately, because the minute has passed',
      'At the next game interruption, such as a kick-off, lack of progress or pushing',
      'Only at the next kick-off',
    ],
    answer: 1,
    feedback:
      'After the minimum minute the robot waits for the next game interruption. The referee then places it in the area of its own corner.',
  },
  {
    id: 'out-goal-teammate-2027',
    title: 'A teammate scores while a robot is out',
    anchor: 'out-of-bounds',
    question:
      'Blue 2 touched the wall and has not been removed yet. Its teammate Blue 1 scores. What do you decide under the 2027 draft?',
    options: [
      'No goal; the whole team is penalized while Blue 2 is on the field',
      'The goal counts; then remove Blue 2',
      'The goal counts and the out-of-bounds call is cancelled',
    ],
    answer: 1,
    feedback:
      'Only goals scored by the penalized robot itself are not granted. The teammate’s goal stands, and Blue 2 still serves its penalty.',
  },
  {
    id: 'out-own-goal-2027',
    title: 'Own goal by a penalized robot',
    anchor: 'out-of-bounds',
    question:
      'A robot that has been called out of bounds, but is still on the field, puts the ball into its own goal. What do you decide under the 2027 draft?',
    options: [
      'No goal, because the penalized robot scored it',
      'Award the goal to the opponent',
      'Neutral kick-off without a goal',
    ],
    answer: 1,
    feedback:
      'The draft states the exception explicitly: an own goal by the penalized robot counts against it.',
  },
  {
    id: 'out-corner-2027',
    title: 'Return position after out of bounds',
    anchor: 'out-of-bounds',
    question:
      'An out-of-bounds robot has served its minute and an interruption allows its return. Where is it placed under the 2027 draft?',
    options: [
      'On the unoccupied neutral spot furthest from the ball, facing its own goal',
      'Where it left the field',
      'In the general area of its own corner',
    ],
    answer: 2,
    feedback:
      'The neutral-spot search is gone for out-of-bounds returns. A repaired damaged robot is different: it still returns on the furthest unoccupied neutral spot, facing its own goal.',
  },
  {
    id: 'kicker-vertical-setup-2027',
    title: 'Vertical kicker test setup',
    anchor: 'kicker-power-measuring',
    question: 'How is the kicker test that the 2027 draft pilots set up?',
    options: [
      'The robot kicks from inside one goal at the opposite goal',
      'The robot lies on its back with the kicker facing up and the ball in its ball-capturing zone',
      'The robot kicks from the center circle at a wall 100 cm away',
    ],
    answer: 1,
    feedback:
      'The vertical test removes the influence of how the goals of a particular field rebound. It is still done with the tournament ball of the robot’s sub-league.',
  },
  {
    id: 'kicker-vertical-result-2027',
    title: 'Vertical kicker test pass or fail',
    anchor: 'kicker-power-measuring',
    question:
      'In the vertical kicker test the ball rises to 120 cm. What is the result?',
    options: [
      'Pass; only a ball that leaves the field fails',
      'Fail; the ball must not rise above 100 cm',
      'Pass if it lands within 30 cm of the robot',
    ],
    answer: 1,
    feedback:
      'The test is passed if the ball height does not exceed 100 cm. Measuring beside a wall with a tape makes the height easy to read.',
  },
];

const OUT = 'Out of bounds';

const CASES_2027: RefereeCase[] = [
  {
    id: 'out-goal-teammate-2027',
    like: 'out-goal',
    title: 'A teammate scores while a robot is out',
    family: 'Scoring',
    clip: 'goal-contact',
    end: 4,
    facts:
      'Blue 2 has already been called out of bounds but is still on the field when its teammate Blue 1 scores.',
    steps: [
      [{ action: 'goal', target: 'blue' }],
      [{ action: 'out', target: 'blue-2' }],
    ],
    explanation:
      'Under the 2027 draft only a goal scored by the penalized robot itself is void. Award Blue the goal, then remove Blue 2 for its penalty.',
    anchor: 'out-of-bounds',
    stopsPlay: true,
  },
  {
    id: 'out-goal-scorer-2027',
    like: 'out-goal',
    title: 'The penalized robot scores',
    family: 'Scoring',
    clip: 'out-scorer-2027',
    end: 5,
    facts:
      'Blue 1 touched the wall, was not removed, and has now scored the goal itself.',
    steps: [[{ action: 'no-goal' }], [{ action: 'out', target: 'blue-1' }]],
    explanation:
      'A goal scored by the penalized robot is not granted. Disallow it, then remove Blue 1 for its penalty.',
    anchor: 'out-of-bounds',
  },
  {
    id: 'pushing-line-2027',
    like: 'pushing',
    title: 'Contact at the pushing line',
    family: 'Pushing & defense',
    clip: 'pushing-line-2027',
    end: 4,
    facts:
      'Yellow and the Blue defender both touch the ball, and the defender has been pushed back onto the pushing line.',
    steps: [[{ action: 'pushing' }]],
    explanation:
      'Robot-ball-robot contact with the defender at the pushing line is pushing under the 2027 draft. Move the ball to the furthest free neutral spot. The line position is provisional.',
  },
  {
    id: 'pushing-short-2027',
    like: 'midfield',
    topic: 'pushing',
    title: 'Contact short of the pushing line',
    family: 'Pushing & defense',
    clip: 'pushing-line-2027',
    end: 2.5,
    facts:
      'Yellow and the Blue defender both touch the ball inside the penalty area. The defender has not reached the pushing line.',
    steps: [[{ action: 'play-on' }]],
    explanation:
      'Contact alone is not pushing under the 2027 draft. Until the defender reaches the pushing line, play continues.',
  },
  {
    id: 'combined-2027',
    like: 'combined',
    title: 'Pushing and multiple defense',
    family: 'Pushing & defense',
    clip: 'combined-line-2027',
    end: 2.5,
    facts:
      'The Blue defender has reached the pushing line during contact with an opponent. Both Blue robots also partly overlap their own penalty area.',
    steps: [
      [{ action: 'pushing' }],
      [{ action: 'multiple', target: 'farther' }],
    ],
    explanation:
      'Resolve pushing first, then reassess defender distances using the NEW ball position before relocating the farther defender.',
  },
  {
    id: 'attackers-area-2027',
    like: 'partial-area',
    topic: 'multiple',
    title: 'Two attackers in the opponent’s area',
    family: 'Pushing & defense',
    clip: 'attackers-area-2027',
    end: 2.5,
    facts:
      'Both Yellow robots partly overlap the penalty area of the goal Blue defends. Neither is fully inside, and no robots touch.',
    steps: [[{ action: 'play-on' }]],
    explanation:
      'Under the 2027 draft multiple defense applies only in a team’s own penalty area. Two attackers partly inside the opponent’s area are left alone.',
  },
  {
    id: 'holding-2027',
    like: 'holding',
    title: 'Trapped ball',
    family: 'Ball movement',
    clip: 'trapped-ball',
    end: 4,
    facts:
      'Blue 1 moves with a fixed, non-rolling ball that Yellow cannot take. The mechanism is represented schematically.',
    steps: [[{ action: 'holding', target: 'blue-1' }]],
    explanation:
      'Under the 2027 draft a robot that holds the ball during gameplay is deemed damaged and loses its inspection sticker. Remove it; it returns only with a compliant mechanism and a new inspection.',
  },
  {
    id: 'out-return-kickoff-2027',
    like: 'return-kickoff',
    title: 'Kick-off before the minute has passed',
    family: 'Damage & returns',
    clip: 'repair-kickoff',
    start: 3,
    end: 3,
    facts:
      'A kickoff is now due. Blue 1 was called out of bounds 25 seconds ago and is ready.',
    bench: [{ robot: 'blue-1', waited: 25, ready: true, reason: OUT }],
    kickoff: true,
    steps: [[{ action: 'keep-out', target: 'blue-1' }]],
    explanation:
      'The 2027 draft makes the minute a minimum for out-of-bounds robots, so this kickoff does not bring Blue 1 back. This follows section 2.8; a damaged robot could still return here.',
    anchor: 'out-of-bounds',
  },
  {
    id: 'out-return-served-2027',
    like: 'return-kickoff',
    title: 'Kick-off after the minute has passed',
    family: 'Damage & returns',
    clip: 'repair-kickoff',
    start: 3,
    end: 3,
    facts:
      'A kickoff is now due. Blue 1 was called out of bounds 75 seconds ago and is ready.',
    bench: [{ robot: 'blue-1', waited: 75, ready: true, reason: OUT }],
    kickoff: true,
    steps: [[{ action: 'return', target: 'blue-1' }]],
    explanation:
      'The minute has been served and a kickoff is a game interruption: permit the return. The robot goes to the area of its own corner.',
    anchor: 'out-of-bounds',
  },
  {
    id: 'out-return-running-2027',
    like: 'return-early',
    title: 'Minute served, play running',
    family: 'Damage & returns',
    clip: 'repair-kickoff',
    end: 0,
    facts:
      'Blue 1 was called out of bounds 75 seconds ago and asks to return. Play is running; there has been no interruption since its minute ended.',
    bench: [{ robot: 'blue-1', waited: 75, ready: true, reason: OUT }],
    steps: [[{ action: 'keep-out', target: 'blue-1' }]],
    explanation:
      'After the minimum minute an out-of-bounds robot returns at the next game interruption, not during running play. Keep it off until then.',
    anchor: 'out-of-bounds',
  },
  {
    id: 'progress-return-first-2027',
    like: 'deadlock',
    title: 'Stationary contest with a robot waiting',
    family: 'Lack of progress',
    clip: 'deadlock',
    end: 4,
    facts:
      'The ball and opponents remain stationary. Blue 2 was called out of bounds 75 seconds ago and is waiting. No referee count has been given yet.',
    bench: [{ robot: 'blue-2', waited: 75, ready: true, reason: OUT }],
    steps: [[{ action: 'count' }], [{ action: 'lack-progress' }]],
    explanation:
      'Count first. Under the 2027 draft a waiting robot whose minute has passed returns before the ball is moved; only if play stays stuck do you count again and place the ball on the nearest free neutral spot.',
  },
  {
    id: 'all-out-2027',
    like: 'all-out',
    title: 'Nobody left on the field',
    family: 'Kickoffs',
    clip: 'pause-neutral',
    end: 0,
    facts:
      'All four robots have been called out of bounds at different times. No robot is left on the field.',
    bench: [
      { robot: 'blue-1', waited: 50, ready: true, reason: OUT },
      { robot: 'blue-2', waited: 35, ready: true, reason: OUT },
      { robot: 'yellow-1', waited: 45, ready: true, reason: OUT },
      { robot: 'yellow-2', waited: 20, ready: true, reason: OUT },
    ],
    steps: [[{ action: 'neutral' }]],
    explanation:
      'Under the 2027 draft a neutral kickoff takes place when all robots of both teams are out of the field. Robots come back for it as soon as they are allowed to return.',
    anchor: 'neutral-kickoff',
    stopsPlay: true,
  },
  {
    id: 'pushed-ramp-2027',
    like: 'pushed-ramp',
    topic: 'out',
    title: 'Pushed onto the ramp',
    family: 'Out of bounds',
    clip: 'pushed-ramp-2027',
    end: 2.5,
    facts:
      'Yellow 1 accidentally pushes Blue 1 onto the ramp along the wall. Blue 1 has not touched the wall.',
    steps: [
      [
        { action: 'waive-out', target: 'blue-1', discretionary: true },
        { action: 'play-on', discretionary: true },
      ],
    ],
    explanation:
      'The 2027 draft lets the referee call pushed out for a robot that an opponent pushes onto the ramp, and move it slightly back onto the field. Letting play continue is also within the referee’s discretion.',
  },
];

export const LEARNING_2027: LearningOverlay = {
  rulesetId: '2027',
  retire: [
    'case:out-goal',
    'case:pushing',
    'case:combined',
    'case:holding',
    'clip:contact-midfield',
    'clip:trapped-ball',
    'clip:wall-touch',
    'scenario:illegal-ball-holding',
    'scenario:pushing-discretion',
    'scenario:pushing-and-multiple-defense',
    'question:kicker-test-setup',
    'question:kicker-test-result',
    'question:return-placement',
  ],
  questionText: {
    'infrared-dimensions': {
      question:
        'Which limits apply to a main-league Soccer Infrared robot in 2027?',
    },
    'colours-lights': {
      feedback:
        'The interference requirement covers lights as well as construction colours. The rules specifically warn about bright red lights being mistaken for the ball.',
    },
    'infrared-ball-change': {
      title: 'The main-league IR ball',
      question:
        'Which ball-size distinction applies to the main rules since 2026 and the separate Entry format?',
      feedback:
        'The 42 mm ball has been the main-league size since 2026; do not apply the legacy large-ball specification to it. Tournament organizers provide game balls, not necessarily practice balls.',
    },
    'multiple-defense-robot-spot': {
      question:
        'Both Blue robots partly overlap their own penalty area; neither is fully inside and no pushing occurs. Blue 1 is 20 cm from the ball and Blue 2 is 45 cm away. Which relocation is correct?',
    },
  },
  clipText: {
    'late-team': {
      feedback:
        'The referee may penalize late arrival by one goal per 30 seconds. This penalty is discretionary, not automatic; under the 2027 draft it ends with an automatic loss at 10–0.',
    },
    'pushing-call': {
      frames: {
        1: { readout: 'Defender at the pushing line' },
        2: { label: 'Pushing called' },
      },
    },
    'pushing-goal': {
      frames: { 0: { label: 'Contact with the defender at the pushing line' } },
    },
    'two-defenders': {
      question:
        'Both Blue robots partly overlap their own penalty area. Which one should you move to the furthest unoccupied neutral spot?',
      feedback:
        'For two same-team robots partly inside their own penalty area, move the one farther from the ball. Here that is Blue 2.',
    },
    'combined-order': {
      question:
        'You call pushing while two Blue robots also partly overlap their own penalty area. Which correction should you make first?',
    },
  },
  caseText: {
    multiple: {
      facts:
        'Both Blue robots partly overlap their own penalty area. Compare their distances to the ball.',
    },
    midfield: {
      explanation:
        'Contact alone does not establish pushing: no defender has reached a pushing line.',
    },
    wall: {
      explanation:
        'Remove Blue 1. Its penalty of at least one minute starts at removal; the training timer advances when you resume the match.',
    },
    'full-area': {
      explanation:
        'Full entry is out of bounds. Remove the robot for at least one minute; it returns at the first game interruption after that.',
    },
    'return-kickoff': {
      title: 'Kickoff return of a repaired robot',
      facts:
        'A kickoff is now due. Blue 1 was taken off as damaged and is fully repaired after only 25 seconds off the field.',
      explanation:
        'A repaired robot may return before a kickoff without waiting for the full minute. This exception is for damaged robots; an out-of-bounds robot serves its whole minute.',
    },
  },
  liveText: {
    pushing: {
      title: 'Contact at the pushing line',
      explanation:
        'The defender reached the pushing line during contact with an opponent, directly or through the ball. Under the 2027 draft that is pushing: move the ball to the furthest free neutral spot.',
    },
    combined: {
      explanation:
        'Pushing is established by the pushing line. Resolve its ball placement first, then reassess multiple defense from the new ball position.',
    },
    wall: {
      explanation:
        'Remove the identified out-of-bounds robot. Its penalty of at least one minute starts at removal; after the minute it returns at the next game interruption.',
    },
    'full-area': {
      explanation:
        'Full entry is out of bounds. Remove the robot for at least one minute; it returns at the first game interruption after that.',
    },
    'out-goal': {
      explanation:
        'A goal scored by a robot that is out of bounds and still on the field is not granted. Disallow it, then remove that robot.',
    },
  },
  questions: QUESTIONS_2027,
  clips: CLIPS_2027,
  sceneClips: SCENE_CLIPS_2027,
  cases: CASES_2027,
  scenarios: [
    {
      id: 'illegal-ball-holding-2027',
      basedOn: 'illegal-ball-holding',
      ruleRef: {
        note: 'The 2027 draft states the consequence during gameplay; this scene teaches recognition of the condition.',
      },
      choices: [
        {
          id: 'call-holding',
          label:
            'Call ball holding: the robot is damaged and loses its inspection sticker',
          grade: 'correct',
          score: 1,
          feedback:
            'Correct. The ball remains inaccessible during a genuine challenge. Under the 2027 draft the robot is deemed damaged and stays out until its mechanism complies and passes inspection again.',
        },
        {
          id: 'brief-observation',
          label: 'Observe the challenge briefly, then call holding',
          grade: 'acceptable',
          score: 0.85,
          feedback:
            'Acceptable. A short observation can establish that the ball is truly unavailable, provided the call is not needlessly delayed.',
        },
        {
          id: 'play-on',
          label: 'Play on because the robot has no powered roller',
          grade: 'incorrect',
          score: 0,
          feedback:
            'The mechanism is not decisive. The observable result is that the robot prevents access to the ball.',
        },
        {
          id: 'inspect-later',
          label: 'Let the robot play on and have it checked after the game',
          grade: 'partial',
          score: 0.25,
          feedback:
            'Recognizing the mechanism problem is useful, but during gameplay the 2027 draft removes the robot as damaged until it complies.',
        },
      ],
    },
  ],
  placement: {
    'case:out-goal-teammate-2027': { replaces: 'case:out-goal' },
    'case:out-goal-scorer-2027': { after: 'case:out-goal-teammate-2027' },
    'case:pushing-line-2027': { replaces: 'case:pushing' },
    'case:pushing-short-2027': { after: 'case:pushing-line-2027' },
    'case:attackers-area-2027': { after: 'case:multiple' },
    'case:combined-2027': { replaces: 'case:combined' },
    'case:holding-2027': { replaces: 'case:holding' },
    'case:out-return-kickoff-2027': { after: 'case:return-kickoff' },
    'case:out-return-served-2027': { after: 'case:out-return-kickoff-2027' },
    'case:out-return-running-2027': { after: 'case:out-return-served-2027' },
    'case:progress-return-first-2027': { after: 'case:repeat-progress' },
    'case:all-out-2027': { after: 'case:ready' },
    'case:pushed-ramp-2027': { after: 'case:pushed-out' },
    'clip:pushing-line-2027': { after: 'clip:pushing-call' },
    'clip:contact-midfield-2027': { replaces: 'clip:contact-midfield' },
    'clip:attackers-area-2027': { after: 'clip:two-defenders' },
    'clip:trapped-ball-2027': { replaces: 'clip:trapped-ball' },
    'clip:wall-touch-2027': { replaces: 'clip:wall-touch' },
    'clip:pushed-ramp-2027': { after: 'clip:pushed-out' },
    'clip:out-scorer-2027': { after: 'clip:pushed-ramp-2027' },
    'scenario:illegal-ball-holding-2027': {
      replaces: 'scenario:illegal-ball-holding',
    },
    'question:kicker-vertical-setup-2027': {
      replaces: 'question:kicker-test-setup',
    },
    'question:kicker-vertical-result-2027': {
      replaces: 'question:kicker-test-result',
    },
    'question:out-corner-2027': { replaces: 'question:return-placement' },
  },
  clipAssessments: {
    'pushing-line-2027': {
      decisionAt: 4,
      context:
        'Yellow and the Blue defender both touch the ball. Yellow keeps driving, and the defender is pushed back onto the provisional pushing line.',
    },
    'contact-midfield-2027': {
      decisionAt: 3,
      context:
        'Both robots and the contested ball are at midfield, outside both penalty areas. No other infringement is established in this example.',
    },
    'attackers-area-2027': {
      decisionAt: 2.5,
      context:
        'Both Yellow robots partly overlap the penalty area of the goal Blue defends. Neither is fully inside, and no robots touch.',
    },
    'trapped-ball-2027': {
      decisionAt: 4,
      context:
        "The ball does not roll as Blue moves. Yellow's side challenge cannot free it. The mechanism itself is represented schematically.",
    },
    'wall-touch-2027': {
      decisionAt: 2,
      context:
        'Blue 1 reaches the physical wall under its own movement. No opponent is touching or pushing it.',
    },
    'pushed-ramp-2027': {
      decisionAt: 2.5,
      context:
        "Yellow's contact displaces Blue 1 onto the ramp along the wall. Blue 1 does not touch the wall. You judge the displacement accidental.",
    },
    'out-scorer-2027': {
      decisionAt: 5,
      context:
        'Blue 1 touched the side wall and was not removed. It then drives back, shoots, and the ball touches the inside back wall of the goal defended by Yellow.',
    },
  },
};
