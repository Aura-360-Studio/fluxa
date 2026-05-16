import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  reducedMotion: boolean;
  viewMode: 'digital' | 'analog';
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
  setViewMode: (mode: 'digital' | 'analog') => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      reducedMotion: false,
      viewMode: 'digital',
      setReducedMotion: (value) => set({ reducedMotion: value }),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'fluxa-settings',
    }
  )
);
