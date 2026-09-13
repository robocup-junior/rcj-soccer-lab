import type { MatchTeam } from '@/lib/simulator/match';

/** Physical goal paint is fixed; team assignment follows the pre-match choice. */
export function GoalTarget({
  team,
  blueAttackDirection,
}: {
  team: MatchTeam;
  blueAttackDirection: 1 | -1;
}) {
  const end =
    (team === 'blue' ? blueAttackDirection : -blueAttackDirection) === 1
      ? 'yellow'
      : 'blue';
  return (
    <span className={`goal-target goal-target-${end}`}>
      <i aria-hidden="true" />
      <span>
        {end === 'blue'
          ? 'Attacks blue-painted goal'
          : 'Attacks yellow-painted goal'}
      </span>
    </span>
  );
}
