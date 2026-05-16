"use client";

import { useEffect, useRef } from "react";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { motion, AnimatePresence } from "framer-motion";

interface SubDialProps {
  value: number;
  label: string;
  unit: string;
  max: number;
  color: string;
}

function SubDial({ value, label, unit, max, color }: SubDialProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        {/* Outer Ring with glass effect */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.02] shadow-inner" />
        
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2.5"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
          />
        </svg>
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[9px] text-white/20 font-bold tracking-[0.1em] mb-1 leading-none">{label}</span>
          <span className="text-xl md:text-2xl font-light text-white tabular-nums leading-none">
            {value > 0 ? value : '--'}
          </span>
          <span className="text-[8px] text-white/30 font-medium tracking-wider mt-1 leading-none">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function AnalogDisplay({ showDetails, qualityColor }: { showDetails: boolean, qualityColor: string }) {
  const { metrics } = useSpeedTestStore();
  const needleRef = useRef<HTMLDivElement>(null);
  const progressArcRef = useRef<SVGPathElement>(null);
  
  // Animation state
  const currentAngleRef = useRef(-120); 
  const targetAngleRef = useRef(-120);
  const velocityRef = useRef(0);
  const displaySpeedRef = useRef(0);

  useEffect(() => {
    let animationFrame: number;
    const circumference = 335; // Length of the arc
    
    const animate = () => {
      // 1. Measurement Smoothing
      displaySpeedRef.current = displaySpeedRef.current * 0.9 + metrics.download * 0.1;
      
      // 2. Map speed to angle (-120deg to 120deg)
      const maxSpeed = metrics.download > 100 ? 300 : 100;
      const targetAngle = (Math.min(displaySpeedRef.current / maxSpeed, 1) * 240) - 120;
      targetAngleRef.current = targetAngle;
      
      // 3. Spring Interpolation
      const force = (targetAngleRef.current - currentAngleRef.current) * 0.08;
      velocityRef.current += force;
      velocityRef.current *= 0.82;
      currentAngleRef.current += velocityRef.current;
      
      // 4. Apply to Needle
      if (needleRef.current) {
        needleRef.current.style.transform = `translateX(-50%) translateY(-100%) rotate(${currentAngleRef.current}deg)`;
      }

      // 5. Apply to Progress Arc
      if (progressArcRef.current) {
        const progress = (currentAngleRef.current + 120) / 240;
        const offset = circumference * (1 - progress);
        progressArcRef.current.style.strokeDashoffset = offset.toString();
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [metrics.download]);

  const maxSpeed = metrics.download > 100 ? 300 : 100;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Dial Container */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-0">
        {/* Glow Layer */}
        <div className="absolute inset-10 rounded-full bg-cyan-glow/5 blur-3xl pointer-events-none" />
        
        {/* SVG Background (Ticks & Scale) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          
          {/* Static Scale Arc */}
          <path
            d="M 30.7 140 A 80 80 0 1 1 169.3 140"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Dynamic Progress Arc */}
          <path
            ref={progressArcRef}
            d="M 30.7 140 A 80 80 0 1 1 169.3 140"
            fill="transparent"
            stroke={qualityColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={335}
            style={{ 
              strokeDashoffset: 335,
              transition: 'stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${qualityColor}66)`
            }}
          />

          {/* Ticks */}
          {[...Array(11)].map((_, i) => {
            const angle = (i * 24) - 120;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = 100 + Math.cos(rad) * 78;
            const y1 = 100 + Math.sin(rad) * 78;
            const x2 = 100 + Math.cos(rad) * 88;
            const y2 = 100 + Math.sin(rad) * 88;
            return (
              <line 
                key={i} 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth={i % 5 === 0 ? "1.5" : "0.5"}
              />
            );
          })}
          {/* Scale Numbers */}
          {(maxSpeed === 100 ? [0, 20, 40, 60, 80, 100] : [0, 60, 120, 180, 240, 300]).map((num) => {
            const angle = (num * (240/maxSpeed)) - 120;
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 100 + Math.cos(rad) * 62;
            const y = 100 + Math.sin(rad) * 62;
            return (
              <text 
                key={num} 
                x={x} y={y} 
                fill="rgba(255,255,255,0.2)" 
                fontSize="7" 
                textAnchor="middle" 
                alignmentBaseline="middle"
                className="font-light tracking-tighter"
              >
                {num}
              </text>
            );
          })}
        </svg>

        {/* Digital Readout */}
        <div className="absolute top-[60%] flex flex-col items-center">
          <span className="text-[9px] text-white/20 font-bold tracking-[0.2em] mb-0.5">Mbps</span>
          <span className="text-4xl md:text-5xl font-extralight text-white tabular-nums tracking-tighter">
            {metrics.download > 0 ? metrics.download : '--'}
          </span>
        </div>

        {/* HTML Needle */}
        <div 
          ref={needleRef}
          className="absolute z-20 w-[2px] h-[65px] bg-gradient-to-t from-[#00f0ff] to-[#00f0ff]/20 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)',
            transform: 'translateX(-50%) translateY(-100%) rotate(-120deg)'
          }}
        />

        {/* Center Cap */}
        <div 
          className="absolute z-30 w-10 h-10 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center shadow-2xl"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
        </div>
      </div>

      {/* Sub Dials */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-10 md:gap-16 mb-2 -mt-6"
          >
            <SubDial 
              value={metrics.upload} 
              label="UPLOAD" 
              unit="Mbps" 
              max={maxSpeed} 
              color="#8a2be2" 
            />
            <SubDial 
              value={metrics.latency} 
              label="LATENCY" 
              unit="ms" 
              max={200} 
              color="#00f0ff" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
