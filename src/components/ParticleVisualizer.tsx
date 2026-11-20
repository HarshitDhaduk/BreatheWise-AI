import React, { useEffect, useRef, useState } from 'react';
import { Wind, Sun, AlertTriangle } from 'lucide-react';

interface ParticleVisualizerProps {
  pm25: number;
  isInversion: boolean;
  cleanWindowActive?: boolean;
}

export const ParticleVisualizer: React.FC<ParticleVisualizerProps> = ({
  pm25,
  isInversion,
  cleanWindowActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simulationMode, setSimulationMode] = useState<'current' | 'inversion' | 'clean_window'>('current');

  const effectiveInversion = simulationMode === 'inversion' 
    ? true 
    : simulationMode === 'clean_window' 
    ? false 
    : (cleanWindowActive ? false : isInversion);

  const effectivePM25 = simulationMode === 'clean_window' || (simulationMode === 'current' && cleanWindowActive)
    ? Math.round(pm25 * 0.45)
    : simulationMode === 'inversion'
    ? Math.max(260, Math.round(pm25 * 1.3))
    : pm25;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 140);

    // Particle count scaled by PM2.5 (capped for performance)
    const particleCount = Math.min(180, Math.max(30, Math.round(effectivePM25 * 0.4)));

    // Inversion ceiling line: low ceiling (~65% from top) when inversion is active
    const ceilingY = effectiveInversion ? height * 0.45 : height * 0.15;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      isTrapped: boolean;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isTrapped = effectiveInversion ? Math.random() < 0.85 : false;
      const yMin = isTrapped ? ceilingY : 0;
      particles.push({
        x: Math.random() * width,
        y: yMin + Math.random() * (height - yMin),
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * (effectiveInversion ? 0.4 : 1.2),
        vy: (Math.random() - 0.5) * (effectiveInversion ? 0.3 : 1.0),
        alpha: Math.random() * 0.6 + 0.2,
        isTrapped,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Atmospheric Layers
      if (effectiveInversion) {
        // Warmer air lid aloft (gradient)
        const warmLidGrad = ctx.createLinearGradient(0, 0, 0, ceilingY);
        warmLidGrad.addColorStop(0, 'rgba(251, 146, 60, 0.08)');
        warmLidGrad.addColorStop(1, 'rgba(239, 68, 68, 0.15)');
        ctx.fillStyle = warmLidGrad;
        ctx.fillRect(0, 0, width, ceilingY);

        // Cold stagnant trapped layer below
        const coldTrapGrad = ctx.createLinearGradient(0, ceilingY, 0, height);
        coldTrapGrad.addColorStop(0, 'rgba(127, 29, 29, 0.25)');
        coldTrapGrad.addColorStop(1, 'rgba(69, 10, 10, 0.45)');
        ctx.fillStyle = coldTrapGrad;
        ctx.fillRect(0, ceilingY, width, height - ceilingY);

        // Dashed ceiling line
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, ceilingY);
        ctx.lineTo(width, ceilingY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label for ceiling
        ctx.fillStyle = '#f87171';
        ctx.font = '10px monospace';
        ctx.fillText('⚡ INVERSION CEILING (BOUNDARY LAYER <150m)', 12, ceilingY - 6);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('Ground Smog Trap (Nocturnal Cooling)', 12, ceilingY + 16);
      } else {
        // Dispersed clean mixing atmosphere
        const cleanGrad = ctx.createLinearGradient(0, 0, 0, height);
        cleanGrad.addColorStop(0, 'rgba(20, 184, 166, 0.15)');
        cleanGrad.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
        ctx.fillStyle = cleanGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#2dd4bf';
        ctx.font = '10px monospace';
        ctx.fillText('☀️ CONVECTIVE SOLAR DISPERSION (Clean Air Window Active)', 12, 18);
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce horizontally
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Inversion bounce vertically
        if (effectiveInversion && p.isTrapped) {
          if (p.y < ceilingY) {
            p.y = ceilingY;
            p.vy = Math.abs(p.vy);
          }
          if (p.y > height) {
            p.y = height;
            p.vy = -Math.abs(p.vy);
          }
        } else {
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = effectiveInversion && p.isTrapped
          ? `rgba(248, 113, 113, ${p.alpha})`
          : `rgba(45, 212, 191, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectivePM25, effectiveInversion]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Atmospheric Boundary Layer Physics Visualizer
          </span>
        </div>

        {/* Simulation Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[10px] font-semibold">
          <button
            onClick={() => setSimulationMode('current')}
            className={`px-2.5 py-1 rounded-lg transition ${
              simulationMode === 'current'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Feed
          </button>
          <button
            onClick={() => setSimulationMode('inversion')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
              simulationMode === 'inversion'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3" /> Nocturnal Inversion
          </button>
          <button
            onClick={() => setSimulationMode('clean_window')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
              simulationMode === 'clean_window'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" /> Midday Solar Breakup
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1 px-1">
        <span>
          {effectiveInversion 
            ? '🔴 Particulates cannot penetrate the warm inversion ceiling aloft and remain trapped in your breathing zone.'
            : '🟢 Convective thermals lift particulate soot aloft, clearing ground air for controlled home ventilation.'}
        </span>
        <span className="text-teal-300 font-mono font-bold shrink-0">
          Simulated PM2.5: {effectivePM25} µg/m³
        </span>
      </div>
    </div>
  );
};
