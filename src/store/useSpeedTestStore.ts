import { create } from 'zustand';
import { engine, SpeedTestResult } from '@/features/speed-test/engine';

export type ConnectionState = 'idle' | 'connecting' | 'testing_ping' | 'testing_download' | 'testing_upload' | 'complete' | 'error';

interface SpeedMetrics {
  download: number;
  upload: number;
  latency: number;
  stability: number; // Placeholder for now
}

interface SpeedTestStore {
  state: ConnectionState;
  metrics: SpeedMetrics;
  startTest: () => void;
  resetTest: () => void;
  setMetric: (key: keyof SpeedMetrics, value: number) => void;
  setState: (state: ConnectionState) => void;
}

export const useSpeedTestStore = create<SpeedTestStore>((set) => ({
  state: 'idle',
  metrics: {
    download: 0,
    upload: 0,
    latency: 0,
    stability: 0,
  },
  
  startTest: async () => {
    set({ 
      state: 'connecting', 
      metrics: { download: 0, upload: 0, latency: 0, stability: 0 } 
    });
    
    try {
      // Brief pause for aesthetics before starting test
      await new Promise(resolve => setTimeout(resolve, 1500));

      await engine.runTest((phase, progress, currentSpeed) => {
        if (phase === 'ping') {
          set({ state: 'testing_ping' });
          if (progress === 1) {
            set((s) => ({ metrics: { ...s.metrics, latency: Math.round(currentSpeed) } }));
          }
        } else if (phase === 'download') {
          set({ state: 'testing_download' });
          // Smooth the display speed
          set((s) => ({ metrics: { ...s.metrics, download: Number(currentSpeed.toFixed(1)) } }));
        } else if (phase === 'upload') {
          set({ state: 'testing_upload' });
          set((s) => ({ metrics: { ...s.metrics, upload: Number(currentSpeed.toFixed(1)) } }));
        }
      });

      // Complete
      set({ state: 'complete' });
    } catch (e) {
      console.error("Speed test failed:", e);
      set({ state: 'error' });
    }
  },
  
  resetTest: () => {
    engine.abort();
    set({ 
      state: 'idle', 
      metrics: { download: 0, upload: 0, latency: 0, stability: 0 } 
    });
  },
  
  setMetric: (key, value) => set((s) => ({ metrics: { ...s.metrics, [key]: value } })),
  setState: (state) => set({ state }),
}));
