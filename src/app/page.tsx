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
  const [location, setLocation] = useState<string>("Sensing Location...");

  useEffect(() => {
    // High-accuracy location using Browser Geolocation with IP fallback
    const fetchLocation = async () => {
      // 1. Try Browser Geolocation first (more accurate)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Reverse geocode using a free service
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await response.json();
              const city = data.address.city || data.address.town || data.address.village || data.address.state_district;
              const countryCode = data.address.country_code?.toUpperCase();
              setLocation(`${city}, ${countryCode}`);
            } catch (error) {
              fetchIpLocation(); // Fallback if reverse geocoding fails
            }
          },
          () => fetchIpLocation() // Fallback if user denies permission
        );
      } else {
        fetchIpLocation();
      }
    };

    const fetchIpLocation = async () => {
      try {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        if (data.status === 'success') {
          setLocation(`${data.city}, ${data.countryCode}`);
        } else {
          setLocation("Global Resonance");
        }
      } catch (error) {
        setLocation("Global Resonance");
      }
    };

    fetchLocation();
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
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          
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
