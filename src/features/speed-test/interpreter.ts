export interface SpeedMetrics {
  download: number;
  upload: number;
  latency: number;
}

export function interpretConnection(metrics: SpeedMetrics): { heading: string, description: string } {
  const { download, upload, latency } = metrics;

  if (download === 0 && upload === 0 && latency === 0) {
    return {
      heading: "Sensing...",
      description: "Analyzing the atmospheric network."
    };
  }

  // Base classification
  if (download >= 100 && upload >= 20 && latency < 40) {
    return {
      heading: "Pristine Flow",
      description: "Crystal clear 4K streaming and effortless large uploads. Instantaneous responsiveness."
    };
  }
  
  if (download >= 25 && latency < 80) {
    return {
      heading: "Strong Resonance",
      description: "HD video calls will be smooth. Streaming and daily tasks are fully supported."
    };
  }

  if (download >= 5) {
    return {
      heading: "Stable Connection",
      description: "Basic web browsing and standard video calls will work fine. Large downloads may take time."
    };
  }

  if (download > 0) {
    return {
      heading: "Weak Field",
      description: "Connection is struggling. Video may buffer and high-bandwidth tasks will be difficult."
    };
  }

  return {
    heading: "Flow Optimized",
    description: "Connection analysis complete."
  };
}
