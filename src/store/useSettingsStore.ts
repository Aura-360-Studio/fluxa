import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      reducedMotion: false,
      setReducedMotion: (value) => set({ reducedMotion: value }),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: 'fluxa-settings',
    }
  )
);
