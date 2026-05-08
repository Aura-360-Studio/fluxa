"use client";

import { useEffect, useRef } from "react";
import { ConnectionState } from "@/store/useSpeedTestStore";
import { useSettingsStore } from "@/store/useSettingsStore";

export type NetworkQuality = 'offline' | 'weak' | 'stable' | 'live' | 'good' | 'super' | 'idle';

interface AuraCanvasProps {
  connectionState?: ConnectionState;
  quality?: NetworkQuality;
}

export default function AuraCanvas({ connectionState = 'idle', quality = 'idle' }: AuraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useSettingsStore();

  const currentColors = useRef({ 
    start: { r: 138, g: 43, b: 226 }, // #8a2be2
    mid:   { r: 65, g: 105, b: 225 }, // #4169E1
    end:   { r: 0, g: 240, b: 255 },  // #00f0ff
    shadow: { r: 0, g: 240, b: 255 }
  });

  const hexToRgb = (hex: string) => {
    const h = parseInt(hex.replace('#', ''), 16);
    return { r: h >> 16, g: h >> 8 & 0xff, b: h & 0xff };
  };

  const rgbToHex = (rgb: { r: number, g: number, b: number }) => {
    return '#' + ((1 << 24) + (Math.round(rgb.r) << 16) + (Math.round(rgb.g) << 8) + Math.round(rgb.b)).toString(16).slice(1);
  };

  const lerp = (a: number, b: number, amount: number) => a + (b - a) * amount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d"); // Re-enable alpha channel for true transparency
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      // Force exact pixel sizes matching the client viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      // Emergency escape if context lost
      if (!ctx || !canvas || canvas.width === 0) return;
      
      let speedMultiplier = 1;
      if (connectionState === 'testing_download' || connectionState === 'testing_upload') {
        speedMultiplier = 3;
      } else if (connectionState === 'complete') {
        speedMultiplier = 0.5;
      } else if (connectionState === 'testing_ping') {
        speedMultiplier = 2;
      } else if (connectionState === 'offline') {
        speedMultiplier = 0.2;
      }

      if (reducedMotion) {
        speedMultiplier *= 0.1;
      }

      // Color Schemes based on Network Quality
      const colorSchemes = {
        offline: { start: "#ff4b2b", mid: "#ff416c", end: "#800000", shadow: "#ff4b2b" },
        weak:    { start: "#f83600", mid: "#f9d423", end: "#ff8c00", shadow: "#f83600" },
        stable:  { start: "#00d2ff", mid: "#3a7bd5", end: "#00f0ff", shadow: "#00d2ff" },
        live:    { start: "#8a2be2", mid: "#4169E1", end: "#00f0ff", shadow: "#00f0ff" },
        good:    { start: "#00b09b", mid: "#96c93d", end: "#00ffaa", shadow: "#00ffaa" },
        super:   { start: "#ffd700", mid: "#ffffff", end: "#ff8c00", shadow: "#ffd700" },
        idle:    { start: "#8a2be2", mid: "#4169E1", end: "#00f0ff", shadow: "#00f0ff" }
      };

      const targetHex = colorSchemes[quality] || colorSchemes.idle;
      const target = {
        start: hexToRgb(targetHex.start),
        mid: hexToRgb(targetHex.mid),
        end: hexToRgb(targetHex.end),
        shadow: hexToRgb(targetHex.shadow)
      };

      const lerpSpeed = 0.03; // Even slower for maximum smoothness

      // Defensive check for hot-reload state mismatch (if useRef still holds strings from previous version)
      if (typeof currentColors.current.start === 'string') {
        currentColors.current = {
          start: hexToRgb("#8a2be2"),
          mid:   hexToRgb("#4169E1"),
          end:   hexToRgb("#00f0ff"),
          shadow: hexToRgb("#00f0ff")
        };
      }

      // Interpolate current RGB values toward target RGB values
      ['start', 'mid', 'end', 'shadow'].forEach((key) => {
        const k = key as keyof typeof currentColors.current;
        currentColors.current[k].r = lerp(currentColors.current[k].r, target[k].r, lerpSpeed);
        currentColors.current[k].g = lerp(currentColors.current[k].g, target[k].g, lerpSpeed);
        currentColors.current[k].b = lerp(currentColors.current[k].b, target[k].b, lerpSpeed);
      });

      const activeColors = {
        start: rgbToHex(currentColors.current.start),
        mid: rgbToHex(currentColors.current.mid),
        end: rgbToHex(currentColors.current.end),
        shadow: rgbToHex(currentColors.current.shadow)
      };

      // Reset all drawing state to prevent shadow bleeding from previous frames
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // Perfectly clear the canvas (fully transparent) so the CSS background shows through
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Determine base radius depending on screen size
      const minDimension = Math.min(canvas.width, canvas.height);
      const isMobile = window.innerWidth < 768;
      // Make it massive enough to wrap the triangular layout
      const baseRadius = minDimension * (isMobile ? 0.35 : 0.40) + (speedMultiplier > 1 && !reducedMotion ? 15 : 0);

      // Safe gradient creation using the interpolated colors
      const gradient = ctx.createLinearGradient(
        centerX - baseRadius, centerY - baseRadius,
        centerX + baseRadius, centerY + baseRadius
      );
      gradient.addColorStop(0, activeColors.start);
      gradient.addColorStop(0.5, activeColors.mid);
      gradient.addColorStop(1, activeColors.end);

      // Multi-layer glowing membrane (Thick & nebulous)
      const layers = [
        { blur: 120, width: 80, alpha: 0.1 }, // Massive atmospheric diffusion
        { blur: 60, width: 50, alpha: 0.3 },  // Broad soft aura
        { blur: 25, width: 20, alpha: 0.6 },  // Thick core energy
        { blur: 8, width: 6, alpha: 0.9 },    // Sharp inner plasma edge
      ];

      layers.forEach((layerConfig, layerIndex) => {
        ctx.beginPath();
        
        // Draw the organic 3-lobed blob
        const step = 0.01;
        for (let i = 0; i < Math.PI * 2; i += step) {
          
          // 1. Core 3-Lobe Geometry (peaks at top, bottom-left, bottom-right)
          const lobeDepth = isMobile ? 20 : 40;
          const lobeShape = Math.sin(i * 3 + Math.PI/2) * lobeDepth;
          
          // 2. Micro-instability (Procedural organic noise simulation)
          const distortionMultiplier = reducedMotion ? 5 : (20 + layerIndex * 6);
          const timeSpeed = time * 0.005 * speedMultiplier;
          
          // Combine low-frequency flowing and high-frequency rippling
          // All multipliers of 'i' must be integers to ensure 2PI periodicity
          const organicNoise = 
            Math.sin(timeSpeed + i * 4) * distortionMultiplier + 
            Math.cos(timeSpeed * 1.5 + i * 2) * (distortionMultiplier * 0.6) +
            Math.sin(timeSpeed * 0.8 - i * 6) * (distortionMultiplier * 0.3);
            
          const r = baseRadius + lobeShape + organicNoise;
          const x = centerX + Math.cos(i) * r;
          const y = centerY + Math.sin(i) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Apply layered glow styles
        ctx.strokeStyle = gradient;
        ctx.lineWidth = layerConfig.width;
        ctx.shadowBlur = layerConfig.blur;
        ctx.shadowColor = activeColors.shadow;
        ctx.globalAlpha = layerConfig.alpha;
        ctx.stroke();
      });

      // Reset alpha for particles
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // 3. Global Signal Dust (Floating colored particles all over)
      if (!reducedMotion) {
        const particleCount = 200;
        const colors = [activeColors.start, activeColors.mid, activeColors.end, "#ffffff"];
        
        for(let p = 0; p < particleCount; p++) {
          const seedX = (p * 7919) % 10000 / 10000;
          const seedY = (p * 6701) % 10000 / 10000;
          const seedColor = (p * 4337) % colors.length;
          
          const driftX = Math.sin(time * 0.001 + p) * 20;
          const driftY = Math.cos(time * 0.0008 + p * 2) * 20;
          
          const x = (seedX * canvas.width + driftX);
          const y = (seedY * canvas.height + driftY);
          
          const shimmer = Math.abs(Math.sin(p * 12 + time * 0.015));
          const size = shimmer * 1.5;
          
          if (size > 0.3) {
            ctx.fillStyle = colors[seedColor];
            ctx.shadowBlur = 4;
            ctx.shadowColor = colors[seedColor];
            ctx.globalAlpha = (0.05 + shimmer * 0.1) * (connectionState === 'testing_download' || connectionState === 'testing_upload' ? 1.5 : 1);
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Aura Dust (Original white particles following the wave contour)
      if (!reducedMotion) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 6;
        ctx.shadowColor = activeColors.shadow;
        
        for(let p = 0; p < 60; p++) {
          const angle = (p * 137.5) * (Math.PI / 180);
          const drift = Math.sin(p * 50 + time * 0.002) * 50;
          const lobeShape = Math.sin(angle * 3 + Math.PI/2) * (isMobile ? 20 : 40);
          
          const r = baseRadius + lobeShape + drift + (Math.cos(p) * 30);
          const currentAngle = angle + (time * 0.0005 * speedMultiplier * (p % 2 === 0 ? 1 : -1));
          
          const x = centerX + Math.cos(currentAngle) * r;
          const y = centerY + Math.sin(currentAngle) * r;
          
          const shimmer = Math.abs(Math.sin(p * 12 + time * 0.015));
          const size = shimmer * 1.5;
          
          if (size > 0.3) {
            ctx.globalAlpha = 0.2 + shimmer * 0.3;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      time += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [connectionState, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{ zIndex: -1 }} // Hard enforce rendering behind everything else in its stacking context
    />
  );
}
