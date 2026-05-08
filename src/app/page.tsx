"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MapPin, Activity, X, Zap, ZapOff, RefreshCcw, Beaker, Download } from "lucide-react";
import AuraCanvas from "@/canvas/AuraCanvas";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { NetworkQuality } from "@/canvas/AuraCanvas";
import { interpretConnection, getOfflineMessage } from "@/features/speed-test/interpreter";

export default function Home() {
  const { state, metrics, showDetails, startTest, startUploadTest } = useSpeedTestStore();
  const { reducedMotion, toggleReducedMotion } = useSettingsStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nodeName, setNodeName] = useState("South India Node");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('SW registered:', reg);
        }).catch(err => {
          console.log('SW registration failed:', err);
        });
      });
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    startTest();
    
    // Fetch nearest network node
    fetch('/api/location')
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          setNodeName(`${data.city} Node`);
        }
      })
      .catch(() => setNodeName("South India Node"));
  }, [startTest]);

  const { setState } = useSpeedTestStore();

  useEffect(() => {
    const handleOffline = () => setState('offline');
    const handleOnline = () => {
      if (state === 'offline') {
        startTest();
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setState('offline');
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [state, setState, startTest]);

  const getStateMessage = () => {
    switch (state) {
      case 'idle': return 'Initializing...';
      case 'connecting': return 'Sensing energy field...';
      case 'testing_ping': return 'Measuring Resonance';
      case 'testing_download': return 'Testing Downstream';
      case 'testing_upload': return 'Testing Upstream';
      case 'complete': return interpretConnection(metrics).heading;
      case 'offline': return getOfflineMessage().heading;
      case 'error': return 'Resonance Interrupted';
      default: return 'Sensing energy field...';
    }
  };

  const interpretation = state === 'offline'
    ? getOfflineMessage().description
    : state === 'complete' 
    ? interpretConnection(metrics).description 
    : 'Your connection is currently being analyzed to provide accurate, real-time metrics.';

  const getNetworkQuality = (): NetworkQuality => {
    if (state === 'offline') return 'offline';
    if (state === 'idle' || state === 'connecting') return 'idle';
    if (metrics.download > 0) {
      if (metrics.download < 1) return 'weak';
      if (metrics.download <= 10) return 'stable';
      if (metrics.download < 50) return 'live';
      if (metrics.download < 100) return 'good';
      return 'super';
    }
    return 'idle';
  };

  const quality = getNetworkQuality();

  const qualityData: Record<NetworkQuality, { label: string, color: string }> = {
    offline: { label: "OFFLINE", color: "#ff4b2b" },
    weak:    { label: "WEAK", color: "#f83600" },
    stable:  { label: "STABLE", color: "#00d2ff" },
    live:    { label: "LIVE", color: "#00f0ff" },
    good:    { label: "GOOD", color: "#00ffaa" },
    super:   { label: "EXCELLENT", color: "#ffd700" },
    idle:    { label: "LIVE", color: "#00f0ff" }
  };

  return (
    <main className="relative min-h-screen flex flex-col font-sans overflow-hidden bg-[#02030A]">
      {/* 1. Atmosphere Layer - CSS Radial Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      {/* 2 & 3. Aura Field & Particle Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AuraCanvas connectionState={state} quality={quality} />
      </div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50 w-full pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Image 
            src="/logo.webp" 
            alt="Fluxa Logo" 
            width={64} 
            height={64}
            style={{ height: 'auto' }}
            className="object-contain w-16 md:w-[88px]"
            priority={true}
          />
        </div>

        <div className="flex items-center gap-4 pointer-events-auto relative">
          <div className="hidden md:flex items-center gap-3 bg-[#050505]/60 border border-white/10 rounded-full px-5 py-2.5 text-xs text-white/60 backdrop-blur-xl shadow-lg">
            <MapPin size={14} className="text-[#00f0ff] opacity-80" />
            <span className="font-light tracking-wide">Connected via <span className="text-white/90 font-medium">{nodeName}</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`w-11 h-11 flex items-center justify-center bg-[#050505]/60 border border-white/10 rounded-full text-white transition-all backdrop-blur-xl z-50 relative shadow-lg ${isMenuOpen ? 'bg-white/10 border-white/30' : 'hover:bg-white/10'}`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* Dropdown Menu (Existing logic) */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-14 right-0 w-64 bg-[#05050a]/95 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl z-40 overflow-hidden"
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Preferences</span>
                      <h3 className="text-sm font-medium text-white mt-1">Interface Settings</h3>
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${!reducedMotion ? 'bg-cyan-glow/10 text-cyan-glow' : 'bg-white/5 text-white/40'}`}>
                          {!reducedMotion ? <Zap size={16} /> : <ZapOff size={16} />}
                        </div>
                        <span className="text-sm text-white/80">Animations</span>
                      </div>
                      <button onClick={toggleReducedMotion} className={`w-11 h-6 rounded-full transition-all relative flex items-center px-1 ${!reducedMotion ? 'bg-cyan-glow' : 'bg-white/10'}`}>
                        <motion.div animate={{ x: !reducedMotion ? 20 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>

                    <div className="h-px bg-white/5 w-full"></div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Beaker size={12} className="text-[#00f0ff] opacity-50" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Origin</span>
                      </div>
                      <p className="text-[11px] text-white/50 font-light leading-relaxed">
                        Fluxa is an experiment from <span className="text-white/80 font-medium">Aura Labs</span>. To explore more procedural interfaces, <a href="https://labs.aura360studio.com/" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:text-[#00f0ff]/80 transition-colors font-medium">check our lab</a>.
                      </p>
                    </div>

                    {!isInstalled && deferredPrompt && (
                      <>
                        <div className="h-px bg-white/5 w-full"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-3">Native Experience</span>
                          <button 
                            onClick={handleInstallClick}
                            className="flex items-center justify-between w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <Download size={14} className="text-[#00f0ff] group-hover:scale-110 transition-transform" />
                              <span className="text-xs text-white/90">Install Fluxa</span>
                            </div>
                            <span className="text-[9px] text-[#00f0ff]/50 font-bold uppercase tracking-wider">Get App</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 4. Metrics Layer - obsidian glass Card */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-6">
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            layout: { type: "spring", stiffness: 100, damping: 30, mass: 1 },
            opacity: { duration: 0.6 }
          }}
          className="relative w-full max-w-[500px] bg-[#050505]/60 border border-white/10 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            {/* Top Section */}
             <motion.div layout className="flex flex-col items-center text-center max-w-md mb-8">
              <div 
                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] mb-6 pt-2 transition-colors duration-500 uppercase"
                style={{ color: qualityData[quality].color }}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                  style={{ backgroundColor: qualityData[quality].color }}
                ></span>
                {qualityData[quality].label}
              </div>

              <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-3 md:mb-4 text-white">
                {getStateMessage()}
              </h1>
              
                <p className="text-[12px] md:text-sm text-white/40 font-light leading-relaxed mb-6 md:mb-10 max-w-[260px] md:max-w-[320px]">
                {interpretation}
              </p>

              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-4">
                  DOWNSTREAM
                </span>
                <div className="flex items-baseline gap-2 md:gap-3">
                  <span className="text-6xl md:text-8xl font-extralight text-white tabular-nums tracking-tighter">
                    {metrics.download > 0 ? metrics.download : '--'}
                  </span>
                  <span 
                    className="text-lg md:text-2xl font-light transition-colors duration-500"
                    style={{ color: qualityData[quality].color }}
                  >
                    Mbps
                  </span>
                </div>
                <div 
                  className="w-16 h-[2px] rounded-full mt-5 opacity-30 transition-colors duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${qualityData[quality].color}, transparent)` }}
                ></div>
              </div>
            </motion.div>

            {/* Middle Section: "Show more info" and "Test Again" Buttons */}
            <AnimatePresence mode="wait">
              {state === 'complete' || state === 'offline' || state === 'error' ? (
                <motion.div
                  key="action-buttons"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-8 w-full"
                >
                  {!showDetails && state !== 'offline' && (
                    <motion.button 
                      whileHover="hover"
                      onClick={() => startUploadTest()}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-md group whitespace-nowrap w-full max-w-[240px] md:w-auto"
                    >
                      <motion.div
                        variants={{
                          hover: { 
                            scale: [1, 1.3, 0.9, 1.1, 1],
                            filter: ["brightness(1)", "brightness(2)", "brightness(1.5)", "brightness(1)"],
                          }
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                      >
                        <Activity size={14} className="text-[#00f0ff]/50 group-hover:text-[#00f0ff] group-hover:drop-shadow-[0_0_8px_#00f0ff] transition-colors" />
                      </motion.div>
                      Upload & Latency
                    </motion.button>
                  )}
                  
                  <motion.button 
                    whileHover="hover"
                    onClick={() => startTest()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 hover:text-white transition-all text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-md group whitespace-nowrap w-full max-w-[240px] md:w-auto"
                  >
                    <motion.div
                      variants={{
                        hover: { rotate: 180 }
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="flex items-center justify-center"
                    >
                      <RefreshCcw size={14} className="text-[#00f0ff]" />
                    </motion.div>
                    {state === 'offline' ? 'Retry Connection' : 'Test Again'}
                  </motion.button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Bottom Section: Progressive disclosure for Upstream & Latency */}
            <AnimatePresence>
              {showDetails && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    height: { type: "spring", stiffness: 100, damping: 30 },
                    opacity: { duration: 0.5, delay: 0.2 }
                  }}
                  className="relative flex items-center justify-between w-full max-w-sm mb-6 md:mb-10 overflow-hidden"
                >
                  {/* Upstream */}
                  <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4 bg-white/[0.03]">
                      <svg className="w-4 h-4 text-[#8a2be2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a2be2] font-bold mb-2">
                      UPSTREAM
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl md:text-3xl font-light text-white tabular-nums">
                        {metrics.upload > 0 ? metrics.upload : '--'}
                      </span>
                      <span className="text-xs text-[#00f0ff] opacity-40 font-light">Mbps</span>
                    </div>
                  </motion.div>

                  {/* Vertical Divider */}
                  <div className="h-14 w-px bg-white/5"></div>

                  {/* Latency */}
                  <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4 bg-white/[0.03]">
                      <Activity className="w-4 h-4 text-[#00f0ff]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#00f0ff] font-bold mb-2">
                      LATENCY
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl md:text-3xl font-light text-white tabular-nums">
                        {metrics.latency > 0 ? metrics.latency : '--'}
                      </span>
                      <span className="text-xs text-[#00f0ff] opacity-40 font-light">ms</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Integrated Footer */}
            <motion.div layout className="flex items-center gap-3 text-white/20 text-[11px] font-light pb-2">
              <Activity size={13} className="text-[#8a2be2]/60" />
              <span>Your connection is being visualized</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Screen Footer */}
      <div className="fixed bottom-6 md:bottom-8 left-0 right-0 px-6 md:px-10 flex items-center justify-center md:justify-end z-20 pointer-events-none">
        <div className="text-white/10 text-[9px] md:text-[10px] font-medium tracking-[0.2em] pointer-events-auto uppercase flex flex-col md:flex-row items-center gap-1 md:gap-1.5 text-center md:text-right">
          <span>POWERED BY</span>
          <a href="https://aura360studio.com/showcase" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#00f0ff] transition-colors duration-300">AURA360STUDIO</a>
        </div>
      </div>
    </main>
  );
}
