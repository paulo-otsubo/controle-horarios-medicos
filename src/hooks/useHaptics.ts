export function useHaptics() {
  function vibrate(pattern: number | number[]) {
    const nav = navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean };
    nav.vibrate?.(pattern);
  }

  const vibrateSuccess = () => vibrate(30);
  const vibrateError = () => vibrate([20, 30, 20]);

  return { vibrateSuccess, vibrateError };
}
