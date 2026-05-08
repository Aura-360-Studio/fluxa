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
  if (download >= 100) {
    return {
      heading: "Excellent Resonance",
      description: "Pristine energy flow. Crystal clear 4K/8K streaming and near-instantaneous responsiveness."
    };
  }
  
  if (download >= 50) {
    return {
      heading: "Strong Flow",
      description: "Strong resonance detected. 4K streaming and simultaneous multi-device usage are effortless."
    };
  }

  if (download >= 11) {
    return {
      heading: "Fluid Connection",
      description: "HD video calls will be smooth. Streaming and daily tasks are fully supported."
    };
  }

  if (download >= 1) {
    return {
      heading: "Stable Field",
      description: "Basic web browsing and standard video calls will work fine. Large downloads may take time."
    };
  }

  if (download > 0) {
    return {
      heading: "Weak Resonance",
      description: "Connection is struggling. Video may buffer and high-bandwidth tasks will be difficult."
    };
  }

  return {
    heading: "Flow Optimized",
    description: "Connection analysis complete."
  };
}

export function getOfflineMessage(): { heading: string, description: string } {
  return {
    heading: "Field Disconnected",
    description: "The energy flow has been interrupted. Please check your network connection and try again."
  };
}
