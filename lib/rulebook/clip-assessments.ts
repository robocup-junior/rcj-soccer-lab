/** Evidence-only cutoffs: stop before the next keyframe interpolates a referee correction.
 * Context supplies facts that remain necessary when teaching captions are hidden.
 * Sources: https://robocup-junior.github.io/soccer-rules/master/rules.html (§§2.1–2.11).
 */
export type ClipAssessment = { decisionAt: number; context: string };

export const CLIP_ASSESSMENTS: Readonly<Record<string, ClipAssessment>> = {
  'match-halves': {
    decisionAt: 3,
    context:
      'Blue took the first-half kickoff. The first half has ended; prepare the second-half restart.',
  },
  'late-team': {
    decisionAt: 3,
    context:
      'Blue is present. Yellow has not arrived for the scheduled start; 30 seconds of lateness have elapsed.',
  },
  'toss-ends': {
    decisionAt: 2.5,
    context:
      'Blue wins the coin toss and chooses to attack the blue-painted goal.',
  },
  'toss-kickoff': {
    decisionAt: 2.5,
    context:
      'Blue wins the coin toss and chooses to kick off first. The teams have not yet chosen their goals.',
  },
  'kickoff-valid': {
    decisionAt: 4,
    context:
      'Blue will kick off. All robots are stopped on their own halves; Yellow is outside the 30 cm center circle. No start signal has been given.',
  },
  'kickoff-early': {
    decisionAt: 2,
    context:
      'The robots are waiting for kickoff. Blue 1 moves; the referee has not given the start signal.',
  },
  'neutral-start': {
    decisionAt: 3,
    context:
      'The ball is at the center for a neutral kickoff. Both teams are stopped on their own halves.',
  },
  'neutral-correction': {
    decisionAt: 0,
    context:
      'This is a neutral kickoff. Blue 1 is inside the 30 cm circle around the centered ball; no start signal has been given.',
  },
  'goal-contact': {
    decisionAt: 4,
    context:
      'Blue attacks the goal defended by Yellow. Compare the ball crossing the mouth with its later contact with the inside back wall.',
  },
  'goal-near-miss': {
    decisionAt: 5,
    context:
      'Blue attacks the goal defended by Yellow. The ball strikes the front of the post and rebounds into the field.',
  },
  'own-goal': {
    decisionAt: 3,
    context:
      "Blue defends the blue-painted goal in this scene. Blue 1 makes the last touch, sending the ball toward that goal's inside back wall.",
  },
  'dribble-access': {
    decisionAt: 6,
    context:
      'Blue moves with a rotating backspin dribbler. Yellow challenges from the side and the ball comes free.',
  },
  'trapped-ball': {
    decisionAt: 4,
    context:
      "The ball does not roll as Blue moves. Yellow's side challenge cannot free it. The mechanism itself is represented schematically.",
  },
  'ball-over-wall': {
    decisionAt: 3.5,
    context:
      'Blue 1 makes the kick. The ball rises above the 22 cm wall and leaves the enclosure.',
  },
  'neutral-response': {
    decisionAt: 5,
    context:
      'Blue starts in its own half beside the nearest neutral spot. No opponent blocks its view of the ball or its movement.',
  },
  'pushing-call': {
    decisionAt: 2.5,
    context:
      'The opponents touch while Blue partly overlaps the penalty area and the ball is in contact. You judge this contact to be pushing.',
  },
  'contact-midfield': {
    decisionAt: 3,
    context:
      'Both robots and the contested ball are at midfield, outside both penalty areas. No other infringement is established in this example.',
  },
  'two-defenders': {
    decisionAt: 2.5,
    context:
      'The ball stays beside Blue 1 as Blue 2 enters the same penalty area. Neither robot is fully inside; no pushing is being called.',
  },
  'combined-order': {
    decisionAt: 2.5,
    context:
      'Pushing and multiple defense occur together. The ball is beside Blue 2 before either correction has been made.',
  },
  'pushing-goal': {
    decisionAt: 3,
    context:
      "In Blue's penalty area, you call pushing. You judge that this contact caused the ball to reach Blue's goal back wall.",
  },
  deadlock: {
    decisionAt: 4,
    context:
      'The ball remains trapped between stationary opponents. The referee has counted visibly and aloud, and play has not progressed.',
  },
  'deadlock-repeat': {
    decisionAt: 4,
    context:
      'The ball has already been moved to one neutral spot. The robots still do not respond, and the situation is unlikely to change.',
  },
  'wall-touch': {
    decisionAt: 2,
    context:
      'Blue 1 reaches the physical wall under its own movement. No opponent is touching or pushing it.',
  },
  'full-area': {
    decisionAt: 3,
    context:
      'Blue 1 is the only robot in this penalty area. Compare its whole overhead footprint with the marked area as it moves inward.',
  },
  'pushed-out': {
    decisionAt: 2.5,
    context:
      "Yellow's contact displaces Blue into the wall. You judge the displacement accidental and choose to waive Blue's out-of-bounds penalty.",
  },
  'repair-clock': {
    decisionAt: 3.5,
    context:
      'Blue 1 was removed as damaged with its motors off and has been repaired. For this decision, assume its full one-minute waiting period has now elapsed.',
  },
  'repair-kickoff': {
    decisionAt: 3,
    context:
      'Blue 1 is repaired and fully functional. It has waited off the field for 25 seconds, and play is about to restart with a kickoff.',
  },
  'both-damaged': {
    decisionAt: 0,
    context:
      'Neither Blue robot is ready at kickoff. Thirty seconds have elapsed with both still damaged; no goal has been awarded for this interval.',
  },
  'team-touch': {
    decisionAt: 0,
    context:
      'Blue 1 appears stuck while play continues. A team member wants to touch it.',
  },
  'referee-unstick': {
    decisionAt: 3,
    context:
      'The robots became entangled through normal interaction, not a design or programming fault. The ball is not being contested near them.',
  },
  'pause-resume': {
    decisionAt: 2,
    context:
      'The referee has stopped play for a discussion. No permission to touch or reposition the robots has been given.',
  },
  'pause-neutral': {
    decisionAt: 0,
    context:
      'Play has stopped with the robots left in their current positions. The restart method has not yet been announced.',
  },
};
