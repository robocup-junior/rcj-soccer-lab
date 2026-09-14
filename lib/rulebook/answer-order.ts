/** Stable within a round; submit original indices/IDs, never display positions. */
export function orderedAnswers<T>(answers: readonly T[], seed: string) {
  let state = 2166136261;
  for (const character of seed)
    state = Math.imul(state ^ character.charCodeAt(0), 16777619) >>> 0;
  const entries = answers.map((answer, index) => ({ answer, index }));
  for (let position = entries.length - 1; position > 0; position--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const other = (state >>> 0) % (position + 1);
    [entries[position], entries[other]] = [entries[other], entries[position]];
  }
  return entries;
}
