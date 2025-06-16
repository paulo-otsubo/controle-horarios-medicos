// no React hooks needed here
import { useUiStore } from '../stores/uiStore';

export function useHaptics() {
  const vibrationEnabled = useUiStore((s) => s.vibration);

  function vibrate(pattern: number | number[]) {
    const nav = navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean };
    if (!vibrationEnabled) return;
    nav.vibrate?.(pattern);
  }

  const vibrateSuccess = () => vibrate(30);
  const vibrateError = () => vibrate([20, 30, 20]);

  return { vibrateSuccess, vibrateError };
}
