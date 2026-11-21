import React, { useState } from 'react';
import { 
  Wind, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Layers, 
  Compass, 
  Eye, 
  ShieldAlert, 
  Sliders, 
  ChevronRight, 
  TrendingDown
} from 'lucide-react';
import { INDIA_CITIES, IndiaCity, getIndiaCitiesByRegion } from '../data/indiaAirData';
import { getAQITheme } from '../utils/aqiCalculator';

interface IndiaAirMapProps {
  onSelectCity: (city: IndiaCity) => void;
  onOpenDelhi3D: () => void;
  onOpenCopilot: (query: string) => void;
  activeCityId?: string;
}

const REGIONS = [
  'All',
  'Indo-Gangetic Plain',
  'Western',
  'Southern',
  'Eastern & Central'
] as const;

export const IndiaAirMap: React.FC<IndiaAirMapProps> = ({
  onSelectCity,
  onOpenDelhi3D,
  onOpenCopilot,
  activeCityId = 'delhi-ncr'
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<IndiaCity>(() => {
    return INDIA_CITIES.find(c => c.id === activeCityId) || INDIA_CITIES[0];
  });
  const [hoveredCity, setHoveredCity] = useState<IndiaCity | null>(null);
  const [showInversionOverlay, setShowInversionOverlay] = useState<boolean>(true);

  const filteredCities = getIndiaCitiesByRegion(selectedRegion);
  const theme = getAQITheme(selectedCity.typicalWinterAQI);

  const getInversionBadge = (tier: IndiaCity['inversionRiskTier']) => {
    switch (tier) {
      case 'Critical':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/40',
          text: 'text-red-400',
          label: 'Critical Inversion Trap (<120m)'
        };
      case 'Severe':
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          label: 'Severe Nocturnal Trap (150-250m)'
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/40',
          text: 'text-yellow-400',
          label: 'Moderate Ridge Inversion'
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          label: 'Low Inversion (Coastal/Plateau)'
        };
    }
  };

  const invBadge = getInversionBadge(selectedCity.inversionRiskTier);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Pan-India Winter Airshed Explorer
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              16 Key Urban Centers & Inversion Micro-Climates
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            India Smog Corridor & Air Quality Geography
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Examine how the Indo-Gangetic Plain acts as a massive thermal inversion aerosol trap between the Himalayas and Central Highlands, contrasting with the elevated Deccan plateau and coastal breeze corridors.
          </p>
        </div>

        {/* Action button to switch to 3D Delhi Simulator */}
        <button
          onClick={onOpenDelhi3D}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition shadow-lg shadow-teal-500/20 shrink-0 group"
        >
          <Layers className="w-4 h-4" />
          <span>Launch Delhi NCR 3D Micro-Map</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Filter Tabs & Inversion Overlay Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedRegion === region
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {region === 'All' ? 'All India (16 Cities)' : region}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowInversionOverlay(!showInversionOverlay)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            showInversionOverlay
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Highlight Indo-Gangetic Smog Belt</span>
        </button>
      </div>

      {/* Main Grid: Interactive Map (Left) + Detailed Telemetry Flyout (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive India Map Canvas / Vector (7 Columns) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 relative min-h-[460px] flex flex-col justify-between overflow-hidden group">
          {/* Legend Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Eye className="w-3 h-3 text-teal-400" /> Interactive Subcontinent Map
            </div>
            <div className="text-[11px] text-slate-400">
              Click any city pin to inspect meteorology & clean-air windows
            </div>
          </div>

          {/* Map Compass */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>NORTH ↑</span>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[400px] mt-8 flex items-center justify-center">
            <svg
              viewBox="0 0 500 580"
              className="w-full h-full max-h-[400px] select-none"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
            >
              <defs>
                {/* Indo-Gangetic Smog Belt Gradient */}
                <linearGradient id="igpGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.35" />
                </linearGradient>

                {/* Subcontinent Fill Gradient */}
                <linearGradient id="landmassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Stylized Accurate India Boundary Vector */}
              <path
                d="M 180 30 
                   C 195 25, 230 45, 240 65 
                   C 255 75, 275 80, 290 85 
                   C 310 90, 325 105, 335 125 
                   C 320 135, 305 140, 295 150 
                   C 330 155, 360 160, 385 165 
                   C 415 170, 440 180, 435 200 
                   C 425 215, 395 210, 375 220 
                   C 360 225, 345 240, 345 255 
                   C 335 270, 325 295, 320 320 
                   C 310 355, 305 385, 290 420 
                   C 275 450, 260 480, 245 520 
                   C 240 535, 235 535, 230 520 
                   C 215 480, 195 440, 180 400 
                   C 165 360, 160 330, 155 300 
                   C 145 270, 125 260, 115 250 
                   C 105 240, 110 225, 125 215 
                   C 135 210, 140 195, 135 180 
                   C 130 160, 140 145, 150 130 
                   C 160 110, 155 85, 165 60 
                   Z"
                fill="url(#landmassGradient)"
                stroke="#334155"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Sub-Himalayan Arc / Indo-Gangetic Basin Smog Corridor Overlay */}
              {showInversionOverlay && (
                <path
                  d="M 160 120 
                     Q 240 150, 310 180 
                     Q 360 210, 370 240 
                     L 340 255 
                     Q 280 210, 220 180 
                     Q 170 160, 150 145 
                     Z"
                  fill="url(#igpGradient)"
                  className="animate-pulse"
                  style={{ animationDuration: '4s' }}
                />
              )}

              {/* Arabian Sea & Bay of Bengal Water Labels */}
              <text x="50" y="380" fill="#475569" fontSize="11" fontFamily="monospace" letterSpacing="2">
                ARABIAN SEA
              </text>
              <text x="350" y="380" fill="#475569" fontSize="11" fontFamily="monospace" letterSpacing="2">
                BAY OF BENGAL
              </text>
              <text x="210" y="560" fill="#475569" fontSize="10" fontFamily="monospace" letterSpacing="2">
                INDIAN OCEAN
              </text>

              {/* Indo-Gangetic Smog Belt Annotation */}
              {showInversionOverlay && (
                <g>
                  <rect x="180" y="165" width="165" height="22" rx="6" fill="#1e1b4b" fillOpacity="0.8" stroke="#818cf8" strokeWidth="1" />
                  <text x="188" y="180" fill="#c7d2fe" fontSize="9.5" fontWeight="bold">
                    ⚠️ Indo-Gangetic Smog Trap
                  </text>
                </g>
              )}
            </svg>

            {/* City Pins Placed Accurately Based on Normalized Map Coordinates */}
            {filteredCities.map((city) => {
              const isSelected = selectedCity.id === city.id;
              const isHovered = hoveredCity?.id === city.id;
              const cityTheme = getAQITheme(city.typicalWinterAQI);

              return (
                <div
                  key={city.id}
                  style={{
                    left: `${city.mapCoords.x}%`,
                    top: `${city.mapCoords.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-transform duration-200"
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => {
                    setSelectedCity(city);
                    onSelectCity(city);
                  }}
                >
                  {/* Outer Pulsing Glow */}
                  <span
                    className={`absolute -inset-2 rounded-full opacity-75 animate-ping pointer-events-none ${
                      isSelected ? 'opacity-100 scale-125' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: cityTheme.hex }}
                  />

                  {/* Marker Pin Center */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                      isSelected 
                        ? 'w-7 h-7 ring-4 ring-white/60 shadow-xl scale-110 z-40' 
                        : isHovered 
                        ? 'w-6 h-6 ring-2 ring-white/40 scale-105' 
                        : 'w-5 h-5 shadow-md'
                    }`}
                    style={{ backgroundColor: cityTheme.hex }}
                  >
                    <span className="text-[10px] font-black text-slate-950">
                      {city.typicalWinterAQI}
                    </span>
                  </div>

                  {/* City Label Badge */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-lg pointer-events-none transition-all ${
                      isSelected
                        ? 'bg-white text-slate-950 ring-2 ring-teal-500 z-40 font-extrabold'
                        : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 backdrop-blur-sm'
                    }`}
                  >
                    {city.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar: Quick comparative stats */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> AQI &gt; 400 (Severe/Hazardous)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> AQI 200-300 (Poor)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> AQI &lt; 100 (Moderate)
              </span>
            </div>
            <span className="text-slate-400 font-mono hidden sm:inline">
              Data: CPCB / SAFAR Winter Inversion Model
            </span>
          </div>
        </div>

        {/* Detailed City Inversion & Telemetry Card (5 Columns) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-950/90 border border-slate-800 p-5 flex flex-col justify-between space-y-5">
          {/* City Title & AQI Score */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {selectedCity.state} • {selectedCity.region}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {selectedCity.name}
                </h3>
              </div>

              {/* Live AQI Badge */}
              <div 
                className={`px-3 py-1.5 rounded-xl border text-center ${theme.badgeBg} ${theme.borderColor} ${theme.textColor}`}
              >
                <div className="text-xl font-black leading-none">{selectedCity.typicalWinterAQI}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">AQI Index</div>
              </div>
            </div>

            {/* Inversion Risk Banner */}
            <div className={`mt-3.5 px-3 py-2 rounded-xl border flex items-center gap-2.5 ${invBadge.bg} ${invBadge.border} ${invBadge.text}`}>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">{invBadge.label}</span>
                <span className="text-[11px] opacity-80 block">
                  Ground-layer cooling traps particulate plumes below the ceiling.
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological & Topographic Breakdown */}
          <div className="space-y-3 text-xs">
            {/* Topography */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" /> Geographic Topography & Airflow
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedCity.geographicTopography}
              </p>
            </div>

            {/* Clean Air Window */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Recommended Clean Air Window
              </div>
              <div className="text-sm font-black text-white">
                {selectedCity.cleanAirWindow.start} – {selectedCity.cleanAirWindow.end}
              </div>
              <p className="text-emerald-200/90 text-[11px] mt-1 leading-relaxed">
                {selectedCity.cleanAirWindow.reason}
              </p>
            </div>

            {/* Key Emission Drivers */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Key Local Emission Drivers
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCity.keyPollutionDrivers.map((driver, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/70 text-slate-300 text-[10px] font-medium"
                  >
                    • {driver}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            {/* If Delhi NCR is selected, highlight the 3D Simulation CTA */}
            {selectedCity.id === 'delhi-ncr' && (
              <button
                onClick={onOpenDelhi3D}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-500/20"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Delhi NCR 10-Station 3D Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectCity(selectedCity)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Set as Active City</span>
              </button>

              <button
                onClick={() => onOpenCopilot(`Provide a detailed winter smog defense and daily routine plan for ${selectedCity.name}, ${selectedCity.state} taking into account its topography (${selectedCity.geographicTopography}) and typical winter AQI of ${selectedCity.typicalWinterAQI}.`)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Ask AI Copilot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Inversion Ranking Strip */}
      <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            <span>National AQI Disparity Ranking (Winter Stagnation vs Dispersion)</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any city to view profile</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {INDIA_CITIES.slice(0, 8).map(city => {
            const isSelected = selectedCity.id === city.id;
            const cityTheme = getAQITheme(city.typicalWinterAQI);
            return (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city);
                  onSelectCity(city);
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500/80 shadow-md ring-1 ring-teal-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 truncate">{city.name}</span>
                  <span 
                    className="text-[10px] font-black px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${cityTheme.hex}25`, color: cityTheme.hex }}
                  >
                    {city.typicalWinterAQI}
                  </span>
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 truncate">
                  {city.region}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
