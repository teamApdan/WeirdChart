/**
 * Ease in out function
 * @param t number
 * @returns 0 to 1
 */
export function easeInOut(t: number) {
  if (t > 1) return 1;
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
