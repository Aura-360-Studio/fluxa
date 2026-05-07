"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MapPin, Activity } from "lucide-react";
import AuraCanvas from "@/canvas/AuraCanvas";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { interpretConnection } from "@/features/speed-test/interpreter";

export default function Home() {
  const { state, metrics, startTest } = useSpeedTestStore();
  const { reducedMotion, toggleReducedMotion } = useSettingsStore();

  useEffect(() => {
    startTest();
  }, [startTest]);

  const getStateMessage = () => {
    switch (state) {
      case 'idle': return 'Initializing...';
      case 'connecting': return 'Sensing energy field...';
      case 'testing_ping': return 'Measuring Resonance';
      case 'testing_download': return 'Testing Downstream';
      case 'testing_upload': return 'Testing Upstream';
      case 'complete': return interpretConnection(metrics).heading;
      default: return 'Sensing energy field...';
    }
  };

  const interpretation = state === 'complete' 
    ? interpretConnection(metrics).description 
    : 'Your connection is currently being analyzed to provide accurate, real-time metrics.';

  return (
    <main className="relative min-h-screen flex flex-col font-sans overflow-hidden bg-[#02030A]">
      {/* 1. Atmosphere Layer - CSS Radial Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      {/* 2 & 3. Aura Field & Particle Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AuraCanvas connectionState={state} />
      </div>
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 md:p-8 flex items-center justify-between z-50 w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Fluxa Logo" 
            width={400} 
            height={400}
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            <MapPin size={16} />
            <span>Bengaluru, IN</span>
          </div>
          <button onClick={toggleReducedMotion} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors backdrop-blur-md">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* 4. Metrics Layer - Perfectly aligned to fit inside the 3 Aura Lobes */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full mt-10">
        
        {/* Container for the Triangular Layout */}
        <div className="relative w-full max-w-4xl aspect-video md:aspect-[4/3] flex items-center justify-center">
          
          {/* Top/Center Lobe: Main Status & Downstream */}
          <div className="absolute top-[10%] md:top-[15%] flex flex-col items-center text-center max-w-md px-6">
            <div className="flex items-center gap-2 text-[#00f0ff] text-xs font-semibold tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
              LIVE
            </div>

            {/* SEO Heading - Hidden from view but visible to crawlers */}
            <h1 className="sr-only">Fluxa | Ad-Free Internet Speed Test & Health Checker</h1>

            <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] via-white to-[#00f0ff] drop-shadow-lg">
              {getStateMessage()}
            </h1>
            
            <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-8 md:mb-12 max-w-sm">
              {interpretation}
            </p>

            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/40 font-semibold mb-2">
                DOWNSTREAM
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl md:text-8xl font-light text-white tabular-nums tracking-tight drop-shadow-lg">
                  {metrics.download > 0 ? metrics.download : '--'}
                </span>
                <span className="text-lg md:text-xl text-[#00f0ff] opacity-80">Mbps</span>
              </div>
              {/* Intense glowing blue accent line */}
              <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent mt-4 opacity-80 shadow-[0_0_15px_#00f0ff]"></div>
            </div>
          </div>

          {/* Bottom Left Lobe: Upstream */}
          <div className="absolute bottom-[10%] md:bottom-[15%] left-[10%] md:left-[15%] flex flex-col items-center">
            {/* Icon Circle */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-[#8a2be2]/10 blur-md"></div>
              <svg className="w-6 h-6 text-[#8a2be2] z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
              {/* Tiny trailing dot */}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
            </div>
            
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#8a2be2] font-semibold mb-1">
              UPSTREAM
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-light text-white tabular-nums drop-shadow-md">
                {metrics.upload > 0 ? metrics.upload : '--'}
              </span>
              <span className="text-xs md:text-sm text-[#00f0ff] opacity-80">Mbps</span>
            </div>
          </div>

          {/* Bottom Right Lobe: Latency */}
          <div className="absolute bottom-[10%] md:bottom-[15%] right-[10%] md:right-[15%] flex flex-col items-center">
            {/* Icon Circle */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-[#00f0ff]/10 blur-md"></div>
              <Activity className="w-6 h-6 text-[#00f0ff] z-10" strokeWidth={1.5} />
              {/* Tiny trailing dot */}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
            </div>
            
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#00f0ff] font-semibold mb-1">
              LATENCY
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-light text-white tabular-nums drop-shadow-md">
                {metrics.latency > 0 ? metrics.latency : '--'}
              </span>
              <span className="text-xs md:text-sm text-[#00f0ff] opacity-80">ms</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-3 text-white/30 text-xs font-light">
          <Activity size={14} className="text-[#8a2be2] animate-pulse" />
          <span>Your connection is being visualized</span>
        </div>
      </div>
    </main>
  );
}
