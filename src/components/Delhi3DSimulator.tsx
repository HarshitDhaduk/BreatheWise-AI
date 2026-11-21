import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Moon, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import { DELHI_MICRO_STATIONS, DelhiMicroStation } from '../data/indiaAirData';
import { getAQITheme } from '../utils/aqiCalculator';

interface Delhi3DSimulatorProps {
  onSelectStation: (station: DelhiMicroStation) => void;
  onOpenCopilot: (query: string) => void;
  activeStationId?: string;
}

export const Delhi3DSimulator: React.FC<Delhi3DSimulatorProps> = ({
  onSelectStation,
  onOpenCopilot,
  activeStationId = 'anand-vihar',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Camera State
  const [rotationAngle, setRotationAngle] = useState(42); // degrees
  const [pitchAngle, setPitchAngle] = useState(58); // degrees tilt
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Atmospheric simulation toggle
  const [inversionState, setInversionState] = useState<'nocturnal_trap' | 'solar_breakup'>('nocturnal_trap');
  const [selectedStation, setSelectedStation] = useState<DelhiMicroStation>(() => {
    return DELHI_MICRO_STATIONS.find(s => s.id === activeStationId) || DELHI_MICRO_STATIONS[0];
  });

  const [hoveredStation, setHoveredStation] = useState<DelhiMicroStation | null>(null);

  // Auto-rotation loop
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.35) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Main 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 750);
    const height = (canvas.height = 420);

    const radRot = (rotationAngle * Math.PI) / 180;
    const radPitch = (pitchAngle * Math.PI) / 180;

    // 3D Projection math: (x, y, z) -> (screenX, screenY)
    // x: -1 to 1 (West to East)
    // y: -1 to 1 (South to North)
    // z: 0 to 1 (Height / Elevation)
    const project3D = (x: number, y: number, z: number) => {
      // Rotate around Z axis (azimuth)
      const rx = x * Math.cos(radRot) - y * Math.sin(radRot);
      const ry = x * Math.sin(radRot) + y * Math.cos(radRot);

      // Pitch around X axis (elevation tilt)
      const py = ry * Math.cos(radPitch) - z * Math.sin(radPitch);
      const pz = ry * Math.sin(radPitch) + z * Math.cos(radPitch);

      // Perspective scale factor
      const fov = 3.2;
      const distance = 4.2 - pz * 0.4;
      const scale = (fov / distance) * zoomLevel * (height * 0.36);

      const screenX = width / 2 + rx * scale;
      const screenY = height / 2 + py * scale + 15;

      return { screenX, screenY, depth: pz };
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw 3D Base Terrain Grid (Delhi NCR Plane)
      const gridSize = 10;
      ctx.lineWidth = 1;

      // Draw grid lines along X
      for (let i = -gridSize; i <= gridSize; i++) {
        const u = i / gridSize;
        const p1 = project3D(u, -1, 0);
        const p2 = project3D(u, 1, 0);

        ctx.strokeStyle = i === 0 ? 'rgba(45, 212, 191, 0.4)' : 'rgba(30, 41, 59, 0.6)';
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.stroke();
      }

      // Draw grid lines along Y
      for (let j = -gridSize; j <= gridSize; j++) {
        const v = j / gridSize;
        const p1 = project3D(-1, v, 0);
        const p2 = project3D(1, v, 0);

        ctx.strokeStyle = j === 0 ? 'rgba(45, 212, 191, 0.4)' : 'rgba(30, 41, 59, 0.6)';
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.stroke();
      }

      // 2. Draw Yamuna River S-Curve in 3D
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const riverSegments = 24;
      for (let r = 0; r <= riverSegments; r++) {
        const t = r / riverSegments;
        const ry = 1.0 - t * 2.0; // North to South
        const rx = 0.25 + Math.sin(t * Math.PI * 1.5) * 0.28; // Meanders East
        const rp = project3D(rx, ry, 0.005);
        if (r === 0) ctx.moveTo(rp.screenX, rp.screenY);
        else ctx.lineTo(rp.screenX, rp.screenY);
      }
      ctx.stroke();

      // 3. Draw Volumetric Thermal Inversion Haze Blanket
      const isInverted = inversionState === 'nocturnal_trap';
      const ceilingHeight = isInverted ? 0.28 : 0.75; // 3D height of smog lid

      // Smog ceiling mesh in 3D
      const cNW = project3D(-1.0, 1.0, ceilingHeight);
      const cNE = project3D(1.0, 1.0, ceilingHeight);
      const cSE = project3D(1.0, -1.0, ceilingHeight);
      const cSW = project3D(-1.0, -1.0, ceilingHeight);

      const hazeGrad = ctx.createLinearGradient(0, cNW.screenY, 0, height);
      if (isInverted) {
        hazeGrad.addColorStop(0, 'rgba(239, 68, 68, 0.12)');
        hazeGrad.addColorStop(0.5, 'rgba(127, 29, 29, 0.32)');
        hazeGrad.addColorStop(1, 'rgba(69, 10, 10, 0.50)');
      } else {
        hazeGrad.addColorStop(0, 'rgba(45, 212, 191, 0.08)');
        hazeGrad.addColorStop(1, 'rgba(15, 23, 42, 0.15)');
      }

      ctx.fillStyle = hazeGrad;
      ctx.beginPath();
      ctx.moveTo(cNW.screenX, cNW.screenY);
      ctx.lineTo(cNE.screenX, cNE.screenY);
      ctx.lineTo(cSE.screenX, cSE.screenY);
      ctx.lineTo(cSW.screenX, cSW.screenY);
      ctx.closePath();
      ctx.fill();

      // Dashed boundary lid contour
      ctx.strokeStyle = isInverted ? 'rgba(248, 113, 113, 0.65)' : 'rgba(45, 212, 191, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Sort Stations by Depth to Render Pillars in Proper Z-Order
      const renderedStations = DELHI_MICRO_STATIONS.map((st) => {
        // Map 0-100 coordinates to -0.85 to +0.85 3D space
        const x3d = (st.gridCoordinates.x / 100) * 1.7 - 0.85;
        const y3d = 0.85 - (st.gridCoordinates.y / 100) * 1.7; // Invert Y for North-South

        // Height proportional to AQI (0.1 to 0.75 3D units)
        const pillarHeight = (st.typicalWinterAQI / 500) * 0.65;

        const base = project3D(x3d, y3d, 0);
        const top = project3D(x3d, y3d, pillarHeight);

        return {
          station: st,
          base,
          top,
          depth: base.depth,
          height3d: pillarHeight,
        };
      });

      // Sort back-to-front (lowest depth first)
      renderedStations.sort((a, b) => a.depth - b.depth);

      // Render 3D Pillars
      renderedStations.forEach(({ station, base, top }) => {
        const isSelected = station.id === selectedStation.id;
        const isHovered = hoveredStation?.id === station.id;
        const theme = getAQITheme(station.typicalWinterAQI);

        // Ground pulse ring
        const ringRadius = isSelected ? 12 : isHovered ? 9 : 6;
        ctx.beginPath();
        ctx.ellipse(base.screenX, base.screenY, ringRadius * 1.4, ringRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(45, 212, 191, 0.3)' : 'rgba(30, 41, 59, 0.8)';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#2dd4bf' : theme.hex;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // 3D Extruded Pillar
        const pillarWidth = isSelected ? 8 : 6;
        const pillarGrad = ctx.createLinearGradient(base.screenX, base.screenY, top.screenX, top.screenY);
        pillarGrad.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
        pillarGrad.addColorStop(0.5, theme.hex);
        pillarGrad.addColorStop(1, '#ffffff');

        ctx.fillStyle = pillarGrad;
        ctx.beginPath();
        ctx.moveTo(base.screenX - pillarWidth / 2, base.screenY);
        ctx.lineTo(top.screenX - pillarWidth / 2, top.screenY);
        ctx.lineTo(top.screenX + pillarWidth / 2, top.screenY);
        ctx.lineTo(base.screenX + pillarWidth / 2, base.screenY);
        ctx.closePath();
        ctx.fill();

        // Glowing Top Orb
        const orbRadius = isSelected ? 6.5 : 4.5;
        ctx.beginPath();
        ctx.arc(top.screenX, top.screenY, orbRadius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#ffffff' : theme.hex;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulsating Hazardous Halo for Anand Vihar / High Hotspots
        if (station.typicalWinterAQI >= 420) {
          const pulseSize = 8 + Math.sin((tick + station.elevationMeters) * 0.1) * 3.5;
          ctx.beginPath();
          ctx.arc(top.screenX, top.screenY, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Label above top
        if (isSelected || isHovered || zoomLevel > 1.1) {
          ctx.fillStyle = isSelected ? '#2dd4bf' : '#ffffff';
          ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${station.name.split('(')[0].trim()}`, top.screenX, top.screenY - 10);
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = theme.hex;
          ctx.fillText(`AQI ${station.typicalWinterAQI}`, top.screenX, top.screenY - 22);
        }
      });

      // 5. Draw 3D Compass Legend
      const compassP = project3D(0.9, 0.9, 0.05);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('N ▲', compassP.screenX, compassP.screenY);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rotationAngle, pitchAngle, zoomLevel, inversionState, selectedStation, hoveredStation, autoRotate]);

  // Mouse interaction handlers for 3D Camera Orbit
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setAutoRotate(false);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setRotationAngle(prev => (prev + dx * 0.5 + 360) % 360);
    setPitchAngle(prev => Math.min(85, Math.max(25, prev - dy * 0.4)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const selectedTheme = getAQITheme(selectedStation.typicalWinterAQI);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-1">
            <Box className="w-3.5 h-3.5" />
            3D Micro-Smog & Inversion Simulator
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            Delhi NCR Atmospheric Smog Topography
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Explore 10 micro-monitoring stations in 3D. See why Anand Vihar spikes past 460 AQI while Central Delhi stays lower under the thermal inversion lid.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => onOpenCopilot(`Explain the micro-climate and pollution drivers for ${selectedStation.name} in Delhi NCR.`)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Ask Station Copilot
        </button>
      </div>

      {/* 3D Viewport with Controls Overlay */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full block cursor-grab active:cursor-grabbing select-none"
        />

        {/* Top Control Bar: Inversion State & Camera Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          {/* Atmospheric State Toggle (Interactive) */}
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 pointer-events-auto shadow-lg">
            <button
              onClick={() => setInversionState('nocturnal_trap')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition ${
                inversionState === 'nocturnal_trap'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" /> Nocturnal Trap (&lt;120m)
            </button>
            <button
              onClick={() => setInversionState('solar_breakup')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition ${
                inversionState === 'solar_breakup'
                  ? 'bg-teal-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" /> Midday Solar Breakup
            </button>
          </div>

          {/* 3D Camera Controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 pointer-events-auto shadow-lg">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-lg text-xs transition ${
                autoRotate ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'
              }`}
              title={autoRotate ? 'Pause 3D rotation' : 'Start auto 3D orbit'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setZoomLevel(z => Math.min(1.6, z + 0.15))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(z => Math.max(0.65, z - 0.15))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 flex items-center gap-3 pointer-events-none">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Anand Vihar (465)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Industrial Wazirpur (440)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Central CP (280)
          </span>
          <span className="text-slate-500 hidden sm:inline">• Drag to orbit 3D</span>
        </div>
      </div>

      {/* Station Selector Pills Grid */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Select Delhi NCR Micro-Monitoring Zone:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DELHI_MICRO_STATIONS.map((station) => {
            const isSelected = station.id === selectedStation.id;
            const theme = getAQITheme(station.typicalWinterAQI);

            return (
              <button
                key={station.id}
                onClick={() => {
                  setSelectedStation(station);
                  onSelectStation(station);
                }}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">{station.zone}</span>
                  <span className="text-xs font-bold text-white truncate block">{station.name.split('(')[0]}</span>
                </div>
                <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-700/60">
                  <span className="text-[10px] text-slate-400">AQI</span>
                  <span className={`text-xs font-black ${theme.textColor}`}>{station.typicalWinterAQI}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Micro-Station Detailed Flyout Card */}
      <div className={`p-5 rounded-2xl border ${selectedTheme.badgeBg} ${selectedTheme.borderColor} transition-all`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedStation.zone} Delhi Monitoring Node
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded uppercase ${selectedTheme.textColor}`}>
                {selectedTheme.label}
              </span>
            </div>

            <h4 className="text-lg font-black text-white">{selectedStation.name}</h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {selectedStation.localVulnerabilityFactor}
            </p>

            {/* Emission Sources Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Key Local Drivers:</span>
              {selectedStation.primaryEmissionSources.map((src, i) => (
                <span key={i} className="text-[10px] bg-slate-800/90 text-slate-200 px-2 py-0.5 rounded-lg border border-slate-700">
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-xl text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase block">Winter AQI</span>
              <span className={`text-2xl font-black ${selectedTheme.textColor}`}>
                {selectedStation.typicalWinterAQI}
              </span>
              <span className="text-[9px] text-slate-400 block">{selectedTheme.category}</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-xl text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase block">PM2.5 Conc.</span>
              <span className="text-2xl font-black text-white">
                {selectedStation.typicalWinterPM25}
              </span>
              <span className="text-[9px] text-slate-400 block">µg/m³</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-xl text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase block">NO₂ Diesel</span>
              <span className="text-2xl font-black text-indigo-400">
                {selectedStation.typicalWinterNO2}
              </span>
              <span className="text-[9px] text-slate-400 block">µg/m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
