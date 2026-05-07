// Duration-Based Speed Test Engine (LibreSpeed style)
// This engine runs for a fixed duration (e.g., 10s) rather than downloading a fixed size.
// This ensures slow mobile networks do not cause infinite loading states.

export interface SpeedTestResult {
  latency: number;
  download: number; // Mbps
  upload: number; // Mbps
}

export type SpeedTestProgressCallback = (
  phase: 'ping' | 'download' | 'upload',
  progress: number, // 0 to 1 based on time
  currentSpeed: number // Mbps
) => void;

class DurationBasedEngine {
  private abortController = new AbortController();
  
  // Configuration
  private TEST_DURATION_MS = 10000; // 10 seconds per phase
  
  // Using a fast CDN endpoint that supports streaming large payloads
  // In Phase 2, this will point to the user's LibreSpeed VPS backend.
  private DL_TEST_URL = 'https://speed.cloudflare.com/__down?bytes=100000000'; // 100MB stream
  private UP_TEST_URL = 'https://speed.cloudflare.com/__up';

  abort() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }

  async measureLatency(onProgress: SpeedTestProgressCallback): Promise<number> {
    const pings: number[] = [];
    for (let i = 0; i < 3; i++) {
      if (this.abortController.signal.aborted) break;
      const start = performance.now();
      try {
        await fetch(this.DL_TEST_URL + `&r=${Math.random()}`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: this.abortController.signal,
        });
        pings.push(performance.now() - start);
      } catch (e) {
        if (!this.abortController.signal.aborted) console.warn("Ping failed", e);
      }
      onProgress('ping', (i + 1) / 3, pings.length ? pings[pings.length - 1] : 0);
    }
    return pings.length ? pings.reduce((a, b) => a + b, 0) / pings.length : 999;
  }

  async measureDownload(onProgress: SpeedTestProgressCallback): Promise<number> {
    const start = performance.now();
    let receivedBytes = 0;
    let finalSpeed = 0;

    try {
      const response = await fetch(this.DL_TEST_URL, {
        cache: 'no-store',
        signal: this.abortController.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();

      while (true) {
        const now = performance.now();
        const elapsed = now - start;

        // Force stop if duration is exceeded! This is the key for mobile/slow networks.
        if (elapsed >= this.TEST_DURATION_MS || this.abortController.signal.aborted) {
          reader.cancel();
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        receivedBytes += value.length;

        const durationInSecs = elapsed / 1000;
        const speedMbps = (receivedBytes * 8) / durationInSecs / (1024 * 1024);
        finalSpeed = speedMbps;
        
        onProgress('download', elapsed / this.TEST_DURATION_MS, speedMbps);
      }

    } catch (e: any) {
      if (e.name !== 'AbortError') console.error("Download test failed", e);
    }
    
    onProgress('download', 1, finalSpeed);
    return finalSpeed;
  }

  async measureUpload(onProgress: SpeedTestProgressCallback): Promise<number> {
    // Generate a moderate chunk of random data (2MB)
    const chunkSize = 2 * 1024 * 1024;
    const chunk = new Uint8Array(chunkSize);
    for(let i=0; i<chunkSize; i++) chunk[i] = Math.floor(Math.random() * 256);

    const start = performance.now();
    let uploadedBytes = 0;
    let finalSpeed = 0;

    // Loop uploading chunks until time runs out
    while (true) {
      const elapsed = performance.now() - start;
      if (elapsed >= this.TEST_DURATION_MS || this.abortController.signal.aborted) {
        break;
      }

      try {
        await fetch(this.UP_TEST_URL, {
          method: 'POST',
          body: chunk,
          cache: 'no-store',
          signal: this.abortController.signal,
        });
        
        uploadedBytes += chunkSize;
        const durationInSecs = (performance.now() - start) / 1000;
        finalSpeed = (uploadedBytes * 8) / Math.max(durationInSecs, 0.1) / (1024 * 1024);
        
        onProgress('upload', Math.min((performance.now() - start) / this.TEST_DURATION_MS, 1), finalSpeed);
      } catch (e: any) {
        if (e.name === 'AbortError') break;
        console.error("Upload chunk failed", e);
        break;
      }
    }

    onProgress('upload', 1, finalSpeed);
    return finalSpeed;
  }

  async runTest(onProgress: SpeedTestProgressCallback): Promise<SpeedTestResult> {
    try {
      const latency = await this.measureLatency(onProgress);
      const download = await this.measureDownload(onProgress);
      const upload = await this.measureUpload(onProgress);
      return { latency, download, upload };
    } catch (e) {
      console.error("Test aborted or failed", e);
      return { latency: 0, download: 0, upload: 0 };
    }
  }
}

export const engine = new DurationBasedEngine();
