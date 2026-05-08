import { create } from 'zustand';
import { engine, SpeedTestResult } from '@/features/speed-test/engine';

export type ConnectionState = 'idle' | 'connecting' | 'testing_ping' | 'testing_download' | 'testing_upload' | 'complete' | 'error' | 'offline';

interface SpeedMetrics {
  download: number;
  upload: number;
  latency: number;
  stability: number; // Placeholder for now
}

interface SpeedTestStore {
  state: ConnectionState;
  metrics: SpeedMetrics;
  showDetails: boolean;
  startTest: () => void;
  startUploadTest: () => void;
  resetTest: () => void;
  setMetric: (key: keyof SpeedMetrics, value: number) => void;
  setState: (state: ConnectionState) => void;
  setShowDetails: (show: boolean) => void;
}

export const useSpeedTestStore = create<SpeedTestStore>((set, get) => ({
  state: 'idle',
  metrics: {
    download: 0,
    upload: 0,
    latency: 0,
    stability: 0,
  },
  showDetails: false,
  
  startTest: async () => {
    engine.abort();
    set({ 
      state: 'connecting', 
      metrics: { download: 0, upload: 0, latency: 0, stability: 0 },
      showDetails: false
    });
    
    try {
      // Brief pause for aesthetics before starting test
      await new Promise(resolve => setTimeout(resolve, 1500));

      // We only run download first in the new model
      set({ state: 'testing_download' });
      await engine.measureDownload((phase, progress, currentSpeed) => {
        set((s) => ({ metrics: { ...s.metrics, download: Number(currentSpeed.toFixed(1)) } }));
      });

      // Instead of finishing everything, we wait for "Show more info"
      set({ state: 'complete' }); 
    } catch (e) {
      console.error("Speed test failed:", e);
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        set({ state: 'offline' });
      } else {
        set({ state: 'error' });
      }
    }
  },

  startUploadTest: async () => {
    const { state } = get();
    if (state !== 'complete') return;

    set({ showDetails: true });

    try {
      // 1. Measure Latency
      set({ state: 'testing_ping' });
      const latency = await engine.measureLatency((phase, progress, currentSpeed) => {
        if (progress === 1) {
          set((s) => ({ metrics: { ...s.metrics, latency: Math.round(currentSpeed) } }));
        }
      });

      // 2. Measure Upload
      set({ state: 'testing_upload' });
      await engine.measureUpload((phase, progress, currentSpeed) => {
        set((s) => ({ metrics: { ...s.metrics, upload: Number(currentSpeed.toFixed(1)) } }));
      });

      set({ state: 'complete' });
    } catch (e) {
      console.error("Upload test failed:", e);
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        set({ state: 'offline' });
      } else {
        // We don't set global error here to keep download result visible
        // But we should probably revert state to complete or something
        set({ state: 'complete' });
      }
    }
  },
  
  resetTest: () => {
    engine.abort();
    set({ 
      state: 'idle', 
      metrics: { download: 0, upload: 0, latency: 0, stability: 0 },
      showDetails: false
    });
  },
  
  setMetric: (key, value) => set((s) => ({ metrics: { ...s.metrics, [key]: value } })),
  setState: (state) => set({ state }),
  setShowDetails: (show) => set({ showDetails: show }),
}));
