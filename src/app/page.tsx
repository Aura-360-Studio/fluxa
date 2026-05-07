"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MapPin, Activity, X, Zap, ZapOff } from "lucide-react";
import AuraCanvas from "@/canvas/AuraCanvas";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { interpretConnection } from "@/features/speed-test/interpreter";

export default function Home() {
  const { state, metrics, startTest } = useSpeedTestStore();
  const { reducedMotion, toggleReducedMotion } = useSettingsStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <header className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-50 w-full pointer-events-none">
        <div className="flex items-center pointer-events-auto">
          <Image 
            src="/logo.webp" 
            alt="Fluxa Logo" 
            width={120} 
            height={120}
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center gap-4 pointer-events-auto relative">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white transition-all backdrop-blur-md z-50 relative ${isMenuOpen ? 'bg-white/10 border-white/30' : 'hover:bg-white/10'}`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10, x: 0 }}
                  className="absolute top-16 right-0 w-64 bg-[#05050a]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-2xl z-40 overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-glow/10 blur-[40px] pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Preferences</span>
                        <h3 className="text-sm font-medium text-white mt-1">Interface</h3>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 w-full"></div>

                    {/* Animation Toggle */}
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${!reducedMotion ? 'bg-cyan-glow/10 text-cyan-glow' : 'bg-white/5 text-white/40'}`}>
                          {!reducedMotion ? <Zap size={16} /> : <ZapOff size={16} />}
                        </div>
                        <span className="text-sm text-white/80 group-hover:text-white transition-colors">Animations</span>
                      </div>

                      <button 
                        onClick={toggleReducedMotion}
                        className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${!reducedMotion ? 'bg-cyan-glow' : 'bg-white/10'}`}
                      >
                        <motion.div 
                          animate={{ x: !reducedMotion ? 24 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-white/30 leading-relaxed">
                        Disable animations if you prefer a static interface or want to save energy.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 4. Metrics Layer - Centered Glassmorphism Card */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-6 py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-2xl bg-white/[0.01] border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Decorative Corner Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8a2be2]/5 blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00f0ff]/5 blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Top Section: Status & Main Metric */}
            <div className="flex flex-col items-center text-center max-w-md mb-10">
              <div className="flex items-center gap-2 text-[#00f0ff] text-[10px] font-semibold tracking-[0.2em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
                LIVE
              </div>

              <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] via-white to-[#00f0ff] drop-shadow-lg">
                {getStateMessage()}
              </h1>
              
              <p className="text-xs md:text-sm text-white/50 font-light leading-relaxed mb-8">
                {interpretation}
              </p>

              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-2">
                  DOWNSTREAM
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl md:text-7xl font-light text-white tabular-nums tracking-tight drop-shadow-lg">
                    {metrics.download > 0 ? metrics.download : '--'}
                  </span>
                  <span className="text-base md:text-lg text-[#00f0ff] opacity-80">Mbps</span>
                </div>
                <div className="w-12 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent mt-3 opacity-60"></div>
              </div>
            </div>

            {/* Bottom Section: Upstream & Latency */}
            <div className="grid grid-cols-2 gap-8 md:gap-20 w-full max-w-sm mb-10">
              {/* Upstream */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3 relative bg-white/5">
                  <div className="absolute inset-0 rounded-full bg-[#8a2be2]/5 blur-md"></div>
                  <svg className="w-4 h-4 text-[#8a2be2] z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8a2be2] font-semibold mb-1">
                  UPSTREAM
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-light text-white tabular-nums">
                    {metrics.upload > 0 ? metrics.upload : '--'}
                  </span>
                  <span className="text-[9px] text-[#00f0ff] opacity-50">Mbps</span>
                </div>
              </div>

              {/* Latency */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3 relative bg-white/5">
                  <div className="absolute inset-0 rounded-full bg-[#00f0ff]/5 blur-md"></div>
                  <Activity className="w-4 h-4 text-[#00f0ff] z-10" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#00f0ff] font-semibold mb-1">
                  LATENCY
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-light text-white tabular-nums">
                    {metrics.latency > 0 ? metrics.latency : '--'}
                  </span>
                  <span className="text-[9px] text-[#00f0ff] opacity-50">ms</span>
                </div>
              </div>
            </div>

            {/* Integrated Footer */}
            <div className="flex items-center gap-2.5 text-white/20 text-[10px] font-light pt-6 border-t border-white/5 w-full justify-center">
              <Activity size={12} className="text-[#8a2be2]/60" />
              <span>Your connection is being visualized</span>
            </div>

          </div>
        </motion.div>

      </div>
    </main>
  );
}
