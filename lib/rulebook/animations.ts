import {
  RCJ_FIELD_DERIVED as FIELD,
  RCJ_SIMULATOR_GUIDES,
} from '../simulator/field-spec';
import { MATCH_ACTORS } from '../simulator/match';
import type { Pose } from '../simulator/types';

export const RULE_ACTORS = MATCH_ACTORS;
export const pose = (x: number, z: number, yaw = 0): Pose => ({ x, z, yaw });
export const NEUTRAL_SPOTS = [
  pose(0, 0),
  ...[-1, 1].flatMap((x) =>
    [-1, 1].map((z) => pose(x * FIELD.neutralSpotX, z * FIELD.neutralSpotZ)),
  ),
];
export function neutralPlacement(
  ball: Pose,
  robots: Pose[],
  farthest: boolean,
) {
  const available = NEUTRAL_SPOTS.filter((spot) =>
    robots.every(
      (robot) => Math.hypot(spot.x - robot.x, spot.z - robot.z) >= 0.21,
    ),
  );
  return (
    [...available].sort(
      (a, b) =>
        (Math.hypot(a.x - ball.x, a.z - ball.z) -
          Math.hypot(b.x - ball.x, b.z - ball.z)) *
        (farthest ? -1 : 1),
    )[0] ?? null
  );
}

export type Keyframe = {
  at: number;
  label: string;
  poses?: Record<string, Pose | null>;
  heights?: Record<string, number>;
  readout?: string;
  focus?: string;
};
export type RuleClip = {
  id: string;
  title: string;
  anchor: string;
  /** Other sections this clip also illustrates and counts toward, in
   * addition to its primary `anchor` (which the UI shows as the rule). */
  alsoAnchors?: string[];
  frames: Keyframe[];
  question: string;
  options: string[];
  answer: number;
  feedback: string;
};
export type RuleScene = {
  poses: Record<string, Pose>;
  heights: Record<string, number>;
  label: string;
  readout: string;
  focus: string | null;
};
const B = 'blue-1';
const B2 = 'blue-2';
const Y = 'yellow-1';
const Y2 = 'yellow-2';
const P = Math.PI;
const base: Record<string, Pose | null> = {
  [B]: pose(-0.24, -0.42),
  [B2]: pose(0.3, -0.66),
  [Y]: pose(0.2, 0.42, P),
  [Y2]: pose(-0.3, 0.66, P),
  ball: pose(0, 0),
};
const kickoff: Record<string, Pose> = {
  [B]: pose(0, -0.18),
  [B2]: pose(0.42, -0.56),
  [Y]: pose(-0.28, 0.38, P),
  [Y2]: pose(0.28, 0.38, P),
  ball: pose(0, 0),
};
const neutral = {
  ...kickoff,
  [B]: pose(-0.28, -0.38),
  [B2]: pose(0.28, -0.38),
};
const far = pose(FIELD.neutralSpotX, FIELD.neutralSpotZ, P);

/** Compact constructor shared with the clips that later rule sets add. */
export function makeClip(
  id: string,
  title: string,
  anchor: string,
  frames: Keyframe[],
  question: string,
  options: string[],
  answer: number,
  feedback: string,
  alsoAnchors?: string[],
): RuleClip {
  return {
    id,
    title,
    anchor,
    frames,
    question,
    options,
    answer,
    feedback,
    ...(alsoAnchors ? { alsoAnchors } : {}),
  };
}

const make = makeClip;

/** Authored teaching scenes. Time is illustrative unless a clock is labelled. */
export const RULE_CLIPS: RuleClip[] = [
  make(
    'match-halves',
    'Two halves & a side swap',
    'pre-match-meeting',
    [
      {
        at: 0,
        label: 'First half',
        poses: kickoff,
        readout: '10:00 · first half',
      },
      {
        at: 3,
        label: 'Half-time interval',
        poses: {
          [B]: pose(-0.4, 0.4, P),
          [Y]: pose(0.4, -0.4),
          ball: pose(0.3, 0.2),
        },
        readout: '5:00 · interval',
      },
      {
        at: 6,
        label: 'Second half · opposite kickoff team',
        poses: {
          [B]: pose(-0.28, 0.38, P),
          [B2]: pose(0.28, 0.38, P),
          [Y]: pose(0, -0.18),
          [Y2]: pose(0.4, -0.5),
          ball: pose(0, 0),
        },
        readout: '10:00 · second half',
      },
    ],
    'Blue kicked off in the first half. Which team should you give the second-half kickoff to?',
    [
      'Yellow, after the teams switch sides',
      'Blue again, after the teams switch sides',
    ],
    0,
    'The teams switch sides at half-time. The team that did not kick off in the first half takes the second-half kickoff.',
    ['game-procedure-and-length-of-a-game'],
  ),
  make(
    'late-team',
    'An empty starting position',
    'game-procedure-and-length-of-a-game',
    [
      {
        at: 0,
        label: 'Waiting at the field',
        poses: { [Y]: null, [Y2]: null },
        readout: 'Arrival example',
      },
      {
        at: 3,
        label: 'Late-arrival interval',
        readout: '+30 s · referee decision',
      },
      {
        at: 6,
        label: 'Team arrives',
        poses: { [Y]: kickoff[Y], [Y2]: kickoff[Y2] },
        readout: 'Discretionary penalty',
      },
    ],
    'Yellow is late for the start. How should you apply the late-arrival goal penalty?',
    [
      'Award Blue a goal every 30 seconds automatically',
      'Decide whether to award Blue a goal for each 30 seconds of lateness',
    ],
    1,
    'The referee may penalize late arrival by one goal per 30 seconds. This penalty is discretionary, not automatic.',
  ),
  make(
    'toss-ends',
    'Choose which goal to attack',
    'pre-match-meeting',
    [
      { at: 0, label: 'Blue wins the toss', readout: 'Toss winner: Blue' },
      {
        at: 2.5,
        label: 'Blue chooses the blue-painted goal to attack',
        poses: { [B]: pose(-0.28, 0.38, P), [B2]: pose(0.28, 0.38, P) },
        readout: 'Blue attacks the blue-painted goal',
      },
      {
        at: 5,
        label: 'Yellow takes the first kickoff',
        poses: { [Y]: pose(0, -0.18), [Y2]: pose(0.4, -0.5), ball: pose(0, 0) },
      },
    ],
    'Blue wins the toss and chooses which goal to attack. What should you give Yellow?',
    [
      'The first kickoff',
      'The choice of goal, leaving the first kickoff to Blue',
    ],
    0,
    'The toss winner chooses either the first kickoff or which goal to attack. The other team gets the remaining choice.',
  ),
  make(
    'toss-kickoff',
    'Choose the kickoff',
    'pre-match-meeting',
    [
      { at: 0, label: 'Blue wins the toss', readout: 'Toss winner: Blue' },
      { at: 2.5, label: 'Blue chooses kickoff', poses: kickoff },
      {
        at: 5,
        label: 'Yellow chooses the blue-painted goal to attack',
        readout: 'Yellow attacks the blue-painted goal',
      },
    ],
    'Blue wins the toss and takes the first kickoff. Who should choose which goal Yellow will attack?',
    [
      'Blue chooses both the kickoff and the goals',
      'Yellow chooses which goal it will attack',
    ],
    1,
    'Choosing the first kickoff leaves the choice of goal to the other team. Goal paint identifies the field end, not its defending team.',
  ),
  make(
    'kickoff-valid',
    'Ready, wait, start',
    'kick-off',
    [
      {
        at: 0,
        label: 'Kickoff team places first',
        poses: { ...kickoff, [Y]: null, [Y2]: null },
        readout: 'Robots stopped',
      },
      {
        at: 2,
        label: 'Opponents take their positions',
        poses: { [Y]: kickoff[Y], [Y2]: kickoff[Y2] },
        readout: 'Outside the 30 cm circle',
      },
      { at: 4, label: 'Wait for the referee', readout: 'Still stopped' },
      {
        at: 5,
        label: 'Start signal · robots may move',
        readout: 'Referee signal',
      },
      {
        at: 6,
        label: 'Start signal',
        poses: {
          [B]: pose(0, -0.1),
          [Y]: pose(-0.17, 0.2, P),
          ball: pose(0, 0.07),
        },
        readout: 'All robots start',
      },
    ],
    'All robots are correctly placed and stopped. When should you allow them to start?',
    [
      'As soon as the last robot is placed',
      "Together, on the referee's start signal",
    ],
    1,
    'Correct placement does not start play. All robots remain stopped until the referee gives the start signal.',
  ),
  make(
    'kickoff-early',
    'One robot starts early',
    'kick-off',
    [
      { at: 0, label: 'Waiting for the start', poses: kickoff },
      {
        at: 2,
        label: 'Blue moves before the signal',
        poses: { [B]: pose(0, -0.11) },
        focus: B,
      },
      {
        at: 3.5,
        label: 'Referee removes Blue 1',
        poses: { [B]: null },
        readout: 'Damaged robot',
      },
      { at: 6, label: 'Remaining robots await kickoff', focus: B2 },
    ],
    'Blue 1 moves before your kickoff signal. What should you do?',
    [
      'Remove Blue 1 and deem it damaged',
      'Return Blue 1 to its starting position without removal',
    ],
    0,
    "A robot started before the referee's command is removed and deemed damaged. This applies to the robot that started early.",
  ),
  make(
    'neutral-start',
    'A neutral restart',
    'neutral-kickoff',
    [
      {
        at: 0,
        label: 'All robots outside the circle',
        poses: neutral,
        readout: '30 cm exclusion · both teams',
      },
      { at: 3, label: 'Wait for the start', readout: 'No kickoff advantage' },
      { at: 4, label: 'Start signal · both teams move' },
      {
        at: 6,
        label: 'Both teams approach',
        poses: { [B]: pose(-0.13, -0.17), [Y]: pose(0.13, 0.17, P) },
      },
    ],
    'You are setting up a neutral kickoff. Which robots must be at least 30 cm from the ball?',
    ['Only the team that did not take the previous kickoff', 'All four robots'],
    1,
    'At a neutral kickoff, every robot must be at least 30 cm from the ball. Neither team has the normal kickoff exception.',
  ),
  make(
    'neutral-correction',
    'Correct an invalid setup',
    'neutral-kickoff',
    [
      {
        at: 0,
        label: 'Blue is too close',
        poses: { ...neutral, [B]: pose(0, -0.2) },
        focus: B,
      },
      {
        at: 3,
        label: 'Referee requests a correction',
        poses: { [B]: neutral[B] },
        readout: 'Reposition before starting',
      },
      { at: 6, label: 'Ready outside the circle', readout: '30 cm' },
    ],
    'At this neutral kickoff, Blue 1 is inside the 30 cm exclusion circle. What should you do before starting?',
    [
      'Request a position correction before the start signal',
      'Allow the position because Blue took the previous kickoff',
    ],
    0,
    'All robots must be at least 30 cm from the ball at a neutral kickoff. The referee can require an incorrect placement to be corrected.',
  ),
  make(
    'goal-contact',
    'A ball reaches the back wall',
    'scoring',
    [
      {
        at: 0,
        label: 'Shot toward the goal defended by Yellow',
        poses: {
          ball: pose(0, 0.6),
          [Y]: pose(0.6, 0.5, P),
          [Y2]: pose(-0.6, 0.5, P),
        },
      },
      {
        at: 3,
        label: 'Goal mouth crossed',
        poses: { ball: pose(0, 1.098) },
        readout: 'Score unchanged',
      },
      {
        at: 4,
        label: 'Back-wall contact',
        poses: { ball: pose(0, FIELD.goalBackContactBallCenterZ) },
        readout: 'BLUE +1',
      },
      {
        at: 6,
        label: 'Yellow kickoff',
        poses: { ...neutral, [Y]: pose(0, 0.18, P) },
      },
    ],
    'The ball crosses the goal mouth and then touches the inside back wall. When should you count the goal?',
    [
      'As soon as the ball crosses the goal mouth',
      'When the ball touches the inside back wall',
    ],
    1,
    "Crossing the goal mouth alone is insufficient. Back-wall contact scores for the team attacking that goal, followed by the conceding team's kickoff.",
  ),
  make(
    'goal-near-miss',
    'A shot clips the post',
    'scoring',
    [
      {
        at: 0,
        label: 'Slow ball approaches the post',
        poses: {
          ball: pose(0.305, 0.83),
          [Y]: pose(0.65, 0.4, P),
          [Y2]: pose(-0.6, 0.5, P),
        },
      },
      {
        at: 2.5,
        label: 'Contact with the front of the post',
        poses: { ball: pose(0.305, FIELD.goalMouthZ - 0.021) },
        readout: 'No back-wall contact',
      },
      {
        at: 5,
        label: 'Post deflection returns to play',
        poses: { ball: pose(0.305, 0.78) },
        readout: 'No goal',
      },
    ],
    'The ball hits the front of the post and returns to the field. What should you decide?',
    [
      'Award Blue a goal because the ball touched the goal structure',
      'Keep the score unchanged because there was no back-wall contact',
    ],
    1,
    "A post deflection without contact with the goal's back wall does not score. Keep the score unchanged.",
  ),
  make(
    'own-goal',
    'A defender deflects the ball',
    'scoring',
    [
      {
        at: 0,
        label: 'Blue defends the blue-painted goal',
        poses: { [B]: pose(0, -0.87, P), ball: pose(0, -0.99) },
      },
      {
        at: 3,
        label: 'Ball touches the back wall of the goal Blue defends',
        poses: { ball: pose(0, -FIELD.goalBackContactBallCenterZ) },
        readout: 'YELLOW +1',
      },
      { at: 6, label: 'Blue takes the kickoff', poses: kickoff },
    ],
    "Blue last touches the ball before it hits the back wall of the goal Blue defends. Which team's score should you increase by one goal?",
    ["Blue — add one to Blue's score", "Yellow — add one to Yellow's score"],
    1,
    "Award Yellow the goal and give Blue the kickoff. A defender's last touch does not change which team scores at that goal.",
  ),
  make(
    'dribble-access',
    'A contestable moving ball',
    'ball-movement',
    [
      {
        at: 0,
        label: 'Blue rolls the ball forward',
        poses: { [B]: pose(-0.1, -0.3), ball: pose(-0.1, -0.177) },
      },
      {
        at: 2,
        label: 'Backspin contact',
        poses: { [B]: pose(-0.1, -0.05), ball: pose(-0.1, 0.073, 14) },
        readout: 'Ball rotates',
      },
      {
        at: 4,
        label: 'Opponent challenges from the side',
        poses: { [Y]: pose(0.015287, 0.11587, -1.926805) },
      },
      {
        at: 6,
        label: 'Ball leaves Blue',
        poses: { ball: pose(-0.28, 0.15, 25) },
        readout: 'Opponent access remains',
      },
    ],
    'Blue uses a backspin dribbler while Yellow can challenge the ball. Should you call ball holding on this evidence?',
    [
      'No; the rotating ball remains accessible to the opponent',
      'Yes; keeping the ball against a dribbler is always holding',
    ],
    0,
    'A rotating dribbler may use dynamic backspin to retain the ball, but opponents must still be able to access it. This scene shows that access.',
  ),
  make(
    'trapped-ball',
    'A locked ball under challenge',
    'ball-movement',
    [
      {
        at: 0,
        label: 'Ball fixed at the front',
        poses: { [B]: pose(-0.1, -0.3), ball: pose(-0.1, -0.2) },
      },
      {
        at: 2,
        label: 'Robot moves; ball does not roll',
        poses: { [B]: pose(-0.1, -0.05), ball: pose(-0.1, 0.05) },
        readout: 'Fixed orientation',
      },
      {
        at: 4,
        label: 'Challenge cannot free the ball',
        poses: { [Y]: pose(0.1, 0.04, -P / 2) },
        readout: 'Teaching example: trapped ball',
      },
      { at: 6, label: 'Inspect the mechanism', focus: B },
    ],
    'The ball stays fixed to Blue while it moves, and Yellow cannot free it. What should you investigate?',
    [
      'A ball-holding mechanism that prevents opponent access',
      'A legal dribbler solely because the ball is in front of the robot',
    ],
    0,
    'A ball fixed to the moving robot and inaccessible to opponents indicates trapping, not the backspin-dribbler exception. Inspect the mechanism; the animation is illustrative.',
  ),
  make(
    'ball-over-wall',
    'A high kick leaves the enclosure',
    'ball-movement',
    [
      {
        at: 0,
        label: 'Blue prepares a high kick',
        poses: { [B]: pose(0.45, 0, P / 2), ball: pose(0.574, 0) },
      },
      {
        at: 2,
        label: 'Ball rises toward the wall',
        poses: { ball: pose(0.8, 0) },
        heights: { ball: 0.29 },
        readout: 'Above the 22 cm wall',
      },
      {
        at: 3.5,
        label: 'Ball exits the enclosure',
        poses: { ball: pose(1.04, 0) },
        heights: { ball: 0.2 },
      },
      {
        at: 5.5,
        label: 'Blue 1 is removed',
        poses: { [B]: null },
        readout: 'Damaged robot',
      },
    ],
    'Blue 1 kicks the ball over the field wall. Which robot should you remove as damaged?',
    [
      'Blue 1, which sent the ball out',
      'Yellow 1, the opponent nearest the ball',
    ],
    0,
    'The robot that sends the ball beyond the field walls or above their height is deemed damaged. Here that robot is Blue 1.',
  ),
  make(
    'neutral-response',
    'Detect, touch, advance',
    'ball-movement',
    [
      {
        at: 0,
        label: 'Ball placed on a neutral spot',
        poses: {
          ball: pose(-FIELD.neutralSpotX, -FIELD.neutralSpotZ),
          [B]: pose(-0.6, -0.85),
        },
      },
      {
        at: 2,
        label: 'Blue approaches the ball',
        poses: { [B]: pose(-FIELD.neutralSpotX, -FIELD.neutralSpotZ - 0.124) },
      },
      {
        at: 5,
        label: 'Ball advances to the opposing half',
        poses: { [B]: pose(-0.25, 0.03), ball: pose(-0.25, 0.154, 18) },
        readout: 'Unobstructed demonstration',
      },
    ],
    'You are checking an unobstructed robot in its own half. Which ball-moving ability must it demonstrate?',
    [
      'Moving the ball from its nearest neutral spot into the opposing half',
      'Moving the ball off the spot is enough, even if it stays in its own half',
    ],
    0,
    'An unobstructed robot must approach and touch a ball at the nearest neutral spot and be able to move it from its own half to the opposing half.',
  ),
  make(
    'pushing-call',
    'Contact, ball, penalty area',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'Opponents converge near the penalty area',
        poses: {
          [B]: pose(-0.08, -0.89),
          [Y]: pose(0.25, -0.62, P),
          ball: pose(-0.051475, -0.770353),
          [B2]: pose(0.6, 0.2),
        },
      },
      {
        at: 2.5,
        label: 'Opponent contact and ball contact',
        poses: { [Y]: pose(0.071, -0.759, P) },
        readout: 'Referee judgment',
      },
      {
        at: 4,
        label: 'Example decision: pushing called',
        focus: B,
        readout: 'Relocate BALL',
      },
      {
        at: 6,
        label: 'Referee moves ball to the far spot',
        poses: { ball: pose(FIELD.neutralSpotX, FIELD.neutralSpotZ) },
        readout: 'Furthest unoccupied neutral spot',
      },
    ],
    'You call pushing in this penalty-area incident. What should you relocate?',
    [
      'The ball, to the furthest unoccupied neutral spot',
      'The defender farther from the ball, leaving the ball in place',
    ],
    0,
    'Resolving a pushing call moves the ball to the furthest unoccupied neutral spot. Moving the farther defender is the separate multiple-defense procedure.',
  ),
  make(
    'contact-midfield',
    'Similar contact at midfield',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'The same approach away from the penalty area',
        poses: {
          [B]: pose(-0.08, -0.09),
          [Y]: pose(0.25, 0.18, P),
          ball: pose(-0.051475, 0.029647),
          [B2]: pose(-0.5, -0.6),
        },
      },
      {
        at: 3,
        label: 'Contact outside the penalty areas',
        poses: { [Y]: pose(0.071, 0.041, P) },
        readout: 'Penalty-area condition absent',
      },
      {
        at: 6,
        label: 'The ball escapes',
        poses: { ball: pose(0.35, -0.18) },
        readout: 'Assess other rules separately',
      },
    ],
    'The opponents touch each other and the ball at midfield. Does this alone justify the penalty-area pushing call?',
    [
      'Yes; opponent contact with the ball is enough anywhere',
      'No; neither robot is even partly inside a penalty area',
    ],
    1,
    'The penalty-area pushing rule requires at least one robot to be partly inside a penalty area. Midfield contact alone does not meet that condition; assess other infringements separately.',
  ),
  make(
    'two-defenders',
    'Which defender must move?',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'One partial overlap',
        poses: {
          [B]: pose(-0.15, -0.87),
          [B2]: pose(0.18, -0.56),
          [Y]: pose(0.5, -0.3, P),
          ball: pose(-0.15, -0.745),
        },
      },
      {
        at: 2.5,
        label: 'Two partial overlaps',
        poses: { [B2]: pose(0.18, -0.87) },
        readout: 'Blue 2 is farther from the ball',
      },
      {
        at: 4,
        label: 'Referee lifts Blue 2',
        heights: { [B2]: 0.25 },
        focus: B2,
      },
      {
        at: 6,
        label: 'Far neutral placement',
        poses: { [B2]: far },
        heights: { [B2]: 0 },
        readout: 'Blue 1 remains',
      },
    ],
    'Both Blue robots partly overlap the penalty area. Which one should you move to the furthest unoccupied neutral spot?',
    [
      'Blue 1, which is nearer the ball',
      'Blue 2, which is farther from the ball',
    ],
    1,
    'For two same-team robots partly inside a penalty area, move the one farther from the ball. Here that is Blue 2.',
  ),
  make(
    'combined-order',
    'Pushing and two defenders',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'Defenders near the area',
        poses: {
          [B]: pose(-0.22, -0.87),
          [B2]: pose(0.18, -0.69, P),
          [Y]: pose(0.18, -0.49, P),
          ball: pose(0.06, -0.7),
        },
      },
      {
        at: 2.5,
        label: 'Second defender moves inward during contact',
        poses: {
          [B2]: pose(0.18, -0.87, P),
          [Y]: pose(0.18, -0.67, P),
          ball: pose(0.06, -0.87),
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
    'You call pushing while two Blue robots also partly overlap the penalty area. Which correction should you make first?',
    [
      'Move the farther Blue defender, then relocate the ball',
      'Resolve pushing by relocating the ball, then reassess multiple defense',
    ],
    1,
    'Resolve pushing first. After moving the ball, reassess which defender is farther from its new position before resolving multiple defense.',
  ),
  make(
    'pushing-goal',
    'A goal caused by pushing',
    'inside-penalty-area',
    [
      {
        at: 0,
        label: 'Eligible pushing contact',
        poses: {
          [B]: pose(-0.08, -0.89),
          [Y]: pose(0.071, -0.759, P),
          ball: pose(-0.051475, -0.770353),
        },
        readout: 'Referee calls pushing',
      },
      {
        at: 3,
        label: 'Pushing sends the ball to the goal back wall',
        poses: { ball: pose(0.01, -FIELD.goalBackContactBallCenterZ) },
        readout: 'Goal not granted',
      },
      {
        at: 6,
        label: 'Resolve the pushing restart',
        poses: { ball: pose(FIELD.neutralSpotX, FIELD.neutralSpotZ) },
      },
    ],
    'You judge that this goal resulted from pushing. Should you award it?',
    [
      'Award the goal, then make the pushing correction',
      'Disallow the goal and resolve the pushing call',
    ],
    1,
    'A goal caused by a pushing situation is not granted. Resolve the pushing call by moving the ball to the furthest unoccupied neutral spot.',
  ),
  make(
    'deadlock',
    'A stationary contest',
    'lack-of-progress',
    [
      {
        at: 0,
        label: 'Ball between stationary opponents',
        poses: {
          [B]: pose(0, -0.124),
          [Y]: pose(0, 0.124, P),
          ball: pose(0, 0),
        },
      },
      {
        at: 2,
        label: 'Referee starts a visible count',
        readout: '1… 2… 3 · illustrative count',
      },
      {
        at: 4,
        label: 'No change in the situation',
        readout: 'Lack of progress called',
      },
      {
        at: 6,
        label: 'Nearest available neutral spot',
        poses: { ball: pose(-FIELD.neutralSpotX, -FIELD.neutralSpotZ) },
      },
    ],
    'After your visible and loud count, this stationary contest is still unlikely to change. What should you do?',
    [
      'Move the ball to the furthest unoccupied neutral spot',
      'Call lack of progress and move the ball to the nearest unoccupied neutral spot',
    ],
    1,
    "After the count, unresolved lack of progress is restarted at the nearest unoccupied neutral spot. The animation's count is illustrative, not a universal three-second deadline.",
  ),
  make(
    'deadlock-repeat',
    'The first relocation does not help',
    'lack-of-progress',
    [
      {
        at: 0,
        label: 'Ball beyond the robots’ response',
        poses: { ball: pose(0.84, 0.82) },
      },
      {
        at: 2.5,
        label: 'First neutral placement',
        poses: { ball: pose(FIELD.neutralSpotX, FIELD.neutralSpotZ) },
      },
      { at: 4, label: 'Still no response', readout: 'Referee reassesses' },
      { at: 6, label: 'A different neutral spot', poses: { ball: pose(0, 0) } },
    ],
    'The first neutral placement has not restored play. What may you do after reassessing lack of progress?',
    [
      'Call it again and use a different neutral spot',
      'Repeat the placement at the same spot until a robot responds',
    ],
    0,
    'If the first relocation does not resolve lack of progress, the referee may call it again and move the ball to a different neutral spot.',
  ),
  make(
    'wall-touch',
    'A robot touches the wall',
    'out-of-bounds',
    [
      {
        at: 0,
        label: 'Approaching the physical wall',
        poses: { [B]: pose(0.6, -0.2, P / 2), ball: pose(-0.5, -0.7) },
      },
      {
        at: 2,
        label: 'Wall contact',
        poses: { [B]: pose(0.81, -0.2, P / 2) },
        readout: 'Out of bounds',
        focus: B,
      },
      {
        at: 3,
        label: 'Robot removed · penalty starts',
        poses: { [B]: null },
        readout: '60 s penalty · match continues',
      },
      {
        at: 6,
        label: 'Eligible return at far neutral spot',
        poses: { [B]: far },
        readout: 'Facing own goal · time compressed',
      },
    ],
    'Blue 1 touches the physical wall without being pushed by an opponent. What should you call?',
    [
      'Out of bounds: remove Blue 1 for one minute',
      'Play on: only leaving the enclosure counts as out of bounds',
    ],
    0,
    'Wall contact is out of bounds. The one-minute penalty starts at removal; the match clock continues, and a kickoff can permit an earlier return.',
  ),
  make(
    'full-area',
    'Partial versus full entry',
    'out-of-bounds',
    [
      {
        at: 0,
        label: 'Partly overlapping the penalty area',
        poses: {
          [B]: pose(0, -0.87),
          [B2]: pose(0.6, 0.2),
          ball: pose(-0.5, -0.2),
        },
        focus: B,
      },
      {
        at: 3,
        label: 'Entire footprint enters the area',
        poses: { [B]: pose(0, -0.965) },
        readout: 'Full entry',
      },
      {
        at: 5,
        label: 'Robot removed',
        poses: { [B]: null },
        readout: 'Out of bounds',
      },
    ],
    'Blue 1 moves from partial overlap to fully inside the penalty area. Which position requires an out-of-bounds call?',
    [
      'The initial partial overlap by Blue 1 alone',
      "The later position with Blue 1's entire footprint inside",
    ],
    1,
    'A robot fully inside a penalty area is out of bounds. Partial overlap by one robot alone is not that offense; the marked white line is part of the area.',
  ),
  make(
    'pushed-out',
    'An opponent pushes a robot out',
    'out-of-bounds',
    [
      {
        at: 0,
        label: 'Opponents beside the wall',
        poses: {
          [B]: pose(0.74, 0, -P / 2),
          [Y]: pose(0.54, 0, P / 2),
          ball: pose(-0.5, 0.4),
        },
      },
      {
        at: 2.5,
        label: 'Opponent displacement creates wall contact',
        poses: { [B]: pose(0.81, 0, -P / 2), [Y]: pose(0.61, 0, P / 2) },
        readout: 'Pushed out · referee judgment',
      },
      {
        at: 5,
        label: 'Example: penalty waived, small correction',
        poses: { [B]: pose(0.74, 0.07, -P / 2), [Y]: pose(0.48, 0, P / 2) },
      },
    ],
    'Yellow accidentally pushes Blue into the wall. If you waive the out-of-bounds penalty, what may you do?',
    [
      'Call pushed out and slightly move Blue back into play',
      'Relocate Blue to the furthest unoccupied neutral spot',
    ],
    0,
    'The referee may waive an accidental opponent-caused out-of-bounds penalty, call pushed out, and make a small correction to return the robot to the field.',
  ),
  make(
    'repair-clock',
    'Repair and return',
    'damaged-robots',
    [
      { at: 0, label: 'Blue 1 stops responding', focus: B },
      {
        at: 2,
        label: 'Permission to remove · motors off',
        poses: { [B]: null },
        readout: 'Penalty clock starts',
      },
      {
        at: 3.5,
        label: 'Repair completed while waiting',
        readout: 'Still waiting for eligibility',
      },
      {
        at: 6,
        label: 'Referee permits the return',
        poses: { [B]: pose(FIELD.neutralSpotX, FIELD.neutralSpotZ, P) },
        readout: '60 s elapsed · time compressed',
      },
    ],
    'Blue has repaired its damaged robot and the one-minute wait has elapsed. What else is required before its return?',
    [
      'The team may place it back without further approval',
      'The referee must permit the return',
    ],
    1,
    'Repair and the waiting requirement do not replace referee permission. With permission, return the robot at the furthest unoccupied neutral spot, facing its own goal.',
  ),
  make(
    'repair-kickoff',
    'A kickoff before the minute expires',
    'damaged-robots',
    [
      {
        at: 0,
        label: 'Repaired robot waiting off the field',
        poses: { [B]: null },
        readout: '25 s into waiting period',
      },
      {
        at: 3,
        label: 'A new kickoff is due',
        poses: { ...kickoff, [B]: null },
      },
      {
        at: 5,
        label: 'Ready robot returns with permission',
        poses: { [B]: kickoff[B] },
        readout: 'Kickoff exception',
      },
    ],
    'Blue 1 is repaired after 25 seconds off the field, and a kickoff is due. May you permit its return now?',
    [
      'Yes, if it is ready and fully functional',
      'No; it must always remain off for a full minute',
    ],
    0,
    "A ready, fully functional robot may return with the referee's permission before the minute expires when a kickoff is due.",
  ),
  make(
    'both-damaged',
    'Neither robot is ready at kickoff',
    'damaged-robots',
    [
      {
        at: 0,
        label: 'Both Blue robots unavailable',
        poses: { ...neutral, [B]: null, [B2]: null },
        readout: 'Kickoff paused',
      },
      {
        at: 3,
        label: 'First elapsed interval',
        readout: '30 s · YELLOW +1 · opponent-violation exception excluded',
      },
      {
        at: 6,
        label: 'One Blue robot becomes ready',
        poses: { [B]: kickoff[B] },
        readout: 'No award if an opponent rule violation caused the damage',
      },
    ],
    'Both Blue robots remain damaged at kickoff. Before awarding Yellow a goal for 30 elapsed seconds, what must you check?',
    [
      "Whether either Blue robot was damaged by an opponent's rule violation",
      'Whether Blue has already completed a full one-minute penalty',
    ],
    0,
    'The repeated 30-second award does not apply if either robot was damaged because the opponent violated the rules. Check the cause before awarding a goal.',
  ),
  make(
    'team-touch',
    'Team intervention during play',
    'human-interference',
    [
      {
        at: 0,
        label: 'A robot appears stuck',
        poses: { [B]: pose(-0.55, -0.3), ball: pose(0.4, 0.2) },
        focus: B,
      },
      {
        at: 3,
        label: 'Pause the proposed intervention',
        readout: 'Ask the referee · no permission yet',
      },
      {
        at: 6,
        label: 'Wait for a decision',
        readout: 'Team touching is not a routine restart',
      },
    ],
    "A team member wants to free Blue's stuck robot during play. Who must authorize the intervention?",
    [
      'The team captain may authorize it',
      'The referee must explicitly permit it',
    ],
    1,
    'Outside kickoff, teams may not touch robots during play without explicit referee permission. A stuck robot does not itself authorize team intervention.',
  ),
  make(
    'referee-unstick',
    'Limited referee assistance',
    'human-interference',
    [
      {
        at: 0,
        label: 'Normal entanglement away from the ball',
        poses: {
          [B]: pose(-0.4, -0.3),
          [Y]: pose(-0.2, -0.3, P),
          ball: pose(0.5, 0.6),
        },
      },
      {
        at: 3,
        label: 'Referee checks the circumstances',
        readout: 'Ball not disputed nearby',
      },
      {
        at: 6,
        label: 'Minimal separation restores movement',
        poses: { [B]: pose(-0.45, -0.3), [Y]: pose(-0.15, -0.3, P) },
      },
    ],
    'Robots became entangled through normal play away from a contested ball. What assistance may you provide?',
    [
      'Pull them apart only enough to move freely again',
      'Move them to neutral spots before restarting play',
    ],
    0,
    'The referee may minimally separate normally entangled robots when the ball is not disputed nearby. This does not cover a robot stuck solely because of its own design or programming.',
  ),
  make(
    'pause-resume',
    'Freeze and resume the same situation',
    'interruption-of-game-ref-interruption',
    [
      { at: 0, label: 'Game in motion', poses: { ball: pose(0.15, 0.1) } },
      {
        at: 2,
        label: 'Referee stops play',
        poses: { [B]: pose(-0.1, -0.1), ball: pose(0.1, 0.08) },
        readout: 'Robots stopped · leave untouched',
      },
      {
        at: 4,
        label: 'Discussion / ball replacement',
        readout: 'Field remains frozen',
      },
      {
        at: 5,
        label: 'Referee signals resume',
        readout: 'Robots may move again',
      },
      {
        at: 6,
        label: 'Resume from the same positions',
        poses: { [B]: pose(0.01, -0.04), ball: pose(0.12, 0.17) },
      },
    ],
    'You have stopped the game to discuss a field issue. May the teams adjust their robots while waiting?',
    [
      'Yes, provided the robots remain in the same half',
      'No; the robots remain stopped and untouched on the field',
    ],
    1,
    'During a referee stoppage, robots remain stopped and untouched on the field. The referee decides whether to resume that situation or use a neutral kickoff.',
  ),
  make(
    'pause-neutral',
    'Restart neutrally after a stoppage',
    'interruption-of-game-ref-interruption',
    [
      {
        at: 0,
        label: 'Referee stops a disputed situation',
        poses: { ball: pose(-0.3, -0.2) },
      },
      {
        at: 3,
        label: 'Referee chooses a neutral restart',
        poses: neutral,
        readout: 'Both teams outside the circle',
      },
      { at: 6, label: 'Await a new start signal', readout: 'Neutral kickoff' },
    ],
    'After stopping the game, who decides whether to resume the same positions or use a neutral kickoff?',
    [
      'The referee chooses the restart',
      'The team that last touched the ball chooses the restart',
    ],
    0,
    "The referee chooses between resuming the stopped situation and a neutral kickoff. A team's last touch does not assign that choice.",
  ),
];

export function clipsFor(anchor: string) {
  if (anchor === 'gameplay') return RULE_CLIPS;
  return RULE_CLIPS.filter(
    (clip) => clip.anchor === anchor || clip.alsoAnchors?.includes(anchor),
  );
}

export function sampleClip(clip: RuleClip, time: number): RuleScene {
  let previousPoses = { ...base };
  let previousHeights: Record<string, number> = {};
  let previousFrame = clip.frames[0];
  const first = clip.frames[0];
  previousPoses = { ...previousPoses, ...first.poses };
  previousHeights = { ...first.heights };
  for (let index = 1; index < clip.frames.length; index += 1) {
    const next = clip.frames[index];
    const nextPoses = { ...previousPoses, ...next.poses };
    const nextHeights = { ...previousHeights, ...next.heights };
    if (time < next.at) {
      const raw = Math.max(
        0,
        Math.min(1, (time - previousFrame.at) / (next.at - previousFrame.at)),
      );
      const t = raw * raw * (3 - 2 * raw);
      const poses: Record<string, Pose> = {};
      const heights: Record<string, number> = {};
      for (const actor of RULE_ACTORS) {
        const a = previousPoses[actor.id];
        const b = nextPoses[actor.id];
        if (!a) continue;
        poses[actor.id] = b
          ? {
              x: a.x + (b.x - a.x) * t,
              z: a.z + (b.z - a.z) * t,
              yaw: a.yaw + (b.yaw - a.yaw) * t,
            }
          : a;
        const baseline = actor.kind === 'ball' ? 0.022 : 0;
        const ah = previousHeights[actor.id] ?? baseline;
        const bh = nextHeights[actor.id] ?? baseline;
        heights[actor.id] = ah + (bh - ah) * t;
      }
      return {
        poses,
        heights,
        label: previousFrame.label,
        readout: previousFrame.readout ?? '',
        focus: previousFrame.focus ?? null,
      };
    }
    previousPoses = nextPoses;
    previousHeights = nextHeights;
    previousFrame = next;
  }
  return {
    poses: Object.fromEntries(
      Object.entries(previousPoses).filter(
        (entry): entry is [string, Pose] => entry[1] !== null,
      ),
    ),
    heights: previousHeights,
    label: previousFrame.label,
    readout: previousFrame.readout ?? '',
    focus: previousFrame.focus ?? null,
  };
}

export const ROBOT_FOOTPRINT_RADIUS = RCJ_SIMULATOR_GUIDES.robotCollisionRadius;
