import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiPrefs {
  vibration: boolean;
  sound: boolean;
  confetti: boolean;
  confirmEnd: boolean;
  toggleVibration: () => void;
  toggleSound: () => void;
  toggleConfetti: () => void;
  toggleConfirmEnd: () => void;
}

export const useUiStore = create<UiPrefs>()(
  persist(
    (set, get) => ({
      vibration: true,
      sound: true,
      confetti: true,
      confirmEnd: true,
      toggleVibration: () => set({ vibration: !get().vibration }),
      toggleSound: () => set({ sound: !get().sound }),
      toggleConfetti: () => set({ confetti: !get().confetti }),
      toggleConfirmEnd: () => set({ confirmEnd: !get().confirmEnd })
    }),
    { name: 'ui-prefs' }
  )
);
