/**
 * Formats a lending pair name for display in the protocol pairs table
 *
 * Extracts the pair name and number from the original format "(Protocol: PairName) - Number"
 * and returns a simplified version. If the pair number is greater than 1, it's appended
 * as (#Number) to distinguish multiple instances of the same pair.
 *
 * @param nameOriginal - The original pair name in format "(CurveLend|Fraxlend: PairName) - Number"
 * @returns Formatted pair name for display
 */
export function pairName(nameOriginal: string) {
  // Extract the pair name and number from the original name
  const match = nameOriginal.match(/\((CurveLend|Fraxlend): ([^)]+)\) - (\d+)/);

  if (!match) {
    return nameOriginal;
  }

  const pairName = match[2];
  const pairNumber = parseInt(match[3], 10);

  // Only show the number if it's greater than 1
  return pairNumber > 1 ? `${pairName} (#${pairNumber})` : pairName;
}
