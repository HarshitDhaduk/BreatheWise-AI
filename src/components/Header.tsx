import React from 'react';
import { Wind, Settings, Users, AlertTriangle, MapPin, Sparkles } from 'lucide-react';
import { AirQualityMetrics } from '../types';
import { getAQITheme } from '../utils/aqiCalculator';
import { SMOG_LOCATIONS } from '../services/airQualityService';

interface HeaderProps {
  metrics: AirQualityMetrics;
  emergencyMode: boolean;
  onToggleEmergency: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onSelectLocation: (loc: typeof SMOG_LOCATIONS[0]) => void;
  vulnerabilityScore: number;
  hasCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  emergencyMode,
  onToggleEmergency,
  onOpenProfile,
  onOpenSettings,
  onSelectLocation,
  vulnerabilityScore,
  hasCustomKey,
}) => {
  const theme = getAQITheme(metrics.aqi);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20">
            <Wind className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                BreatheWise <span className="text-teal-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">AI</span>
              </span>
              {hasCustomKey && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Gemini Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Urban Air Quality & Winter Smog Copilot</p>
          </div>
        </div>

        {/* Center: Location selector & AQI live pill */}
        <div className="flex items-center gap-3">
          {/* Location Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition"
              aria-label="Select location"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span className="max-w-[120px] sm:max-w-[160px] truncate">{metrics.locationName}</span>
            </button>
            <div className="absolute left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                Smog Inversion Hotspots
              </div>
              {SMOG_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => onSelectLocation(loc)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/80 hover:text-teal-300 flex items-center justify-between transition"
                >
                  <span className="font-medium">{loc.name}</span>
                  <span className="text-[10px] text-slate-400">{loc.country}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live AQI Badge */}
          <div 
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${theme.badgeBg} ${theme.borderColor} ${theme.textColor}`}
            role="status"
            aria-live="polite"
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.hex }}></span>
            <span>AQI {metrics.aqi}</span>
            <span className="text-slate-400">|</span>
            <span className="font-normal truncate max-w-[140px]">{theme.category}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Smog Mode Button */}
          <button
            onClick={onToggleEmergency}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              emergencyMode
                ? 'bg-red-600 text-white ring-2 ring-red-400 animate-pulse'
                : 'bg-red-950/40 text-red-300 hover:bg-red-900/50 border border-red-800/50'
            }`}
            title="Toggle Severe Smog Emergency Lockdown Mode"
            aria-pressed={emergencyMode}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Emergency Mode</span>
          </button>

          {/* Family Vulnerability Profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            aria-label="Family vulnerability profile"
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Family Risk:</span>
            <span className={`font-bold ${vulnerabilityScore >= 3.5 ? 'text-rose-400' : 'text-teal-400'}`}>
              {vulnerabilityScore.toFixed(1)}/5
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            aria-label="Open settings and API configuration"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
