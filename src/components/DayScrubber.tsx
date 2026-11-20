import React, { useState } from 'react';
import { 
  Clock, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  CheckCircle, 
  Sparkles
} from 'lucide-react';
import { DiurnalPoint } from '../types';
import { getAQITheme } from '../utils/aqiCalculator';

interface DayScrubberProps {
  diurnal: DiurnalPoint[];
  currentHour: number;
  onOpenCopilot: (query: string) => void;
}

export const DayScrubber: React.FC<DayScrubberProps> = ({
  diurnal,
  currentHour,
  onOpenCopilot,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(currentHour);

  const selectedPoint = diurnal[selectedHour] || diurnal[0] || {
    time: '12:00',
    pm25: 140,
    aqi: 195,
    temperature: 15,
    isCleanWindow: true,
  };

  const theme = getAQITheme(selectedPoint.aqi);

  // Determine atmospheric state at selected hour
  let atmosphericState = {
    title: 'Midday Convective Mixing',
    icon: <Sun className="w-4 h-4 text-amber-400" />,
    badgeColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
    description: 'Solar heating warms the asphalt and soil, generating convective thermal updrafts that thin out the nocturnal inversion boundary layer.',
    activityAdvisory: 'Optimal window for 15-minute home air flush and essential outdoor errands. PM2.5 drops to its 24-hour lowest point.',
    isSafeWindow: true,
  };

  if (selectedHour >= 6 && selectedHour <= 9) {
    atmosphericState = {
      title: 'Morning Rush & Inversion Peak',
      icon: <Sunrise className="w-4 h-4 text-rose-400" />,
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      description: 'Cold nocturnal ground temperature compresses the boundary layer to below 120m, trapping heavy school bus and diesel truck exhaust.',
      activityAdvisory: 'Strictly avoid outdoor jogging and cycling. Close vehicle windows and set ventilation to internal re-circulation.',
      isSafeWindow: false,
    };
  } else if (selectedHour >= 18 && selectedHour <= 22) {
    atmosphericState = {
      title: 'Sunset Inversion & Heating Trap',
      icon: <Sunset className="w-4 h-4 text-orange-400" />,
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      description: 'Rapid post-sunset cooling creates a sharp ground-level thermal lid. Evening domestic heating, cooking, and traffic fumes cannot escape.',
      activityAdvisory: 'Seal all windows before 5:30 PM. Keep indoor air purifiers running in bedrooms and avoid outdoor dinners.',
      isSafeWindow: false,
    };
  } else if (selectedHour >= 23 || selectedHour <= 5) {
    atmosphericState = {
      title: 'Nocturnal Cold Air Stagnation',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Zero wind velocity and heavy cold air pool in low-lying city basins, maintaining dangerous particulate levels throughout the night.',
      activityAdvisory: 'Bedroom clean-air sanctuary active. Run DIY Corsi-Rosenthal box or HEPA filter on quiet speed all night.',
      isSafeWindow: false,
    };
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            24-Hour Winter Smog & Inversion Day-Scrubber
          </h3>
          <p className="text-xs text-slate-400">
            Scrub through the day to see when atmospheric inversions trap smog and when midday solar thermals open clean-air windows.
          </p>
        </div>

        <button
          onClick={() => onOpenCopilot(`What is the optimal hourly routine and clean-air window for today?`)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Ask Timing Copilot
        </button>
      </div>

      {/* Scrub Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-400">00:00 Midnight</span>
          <span className="text-teal-400 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Selected Time: {selectedPoint.time} {selectedHour === currentHour ? '(Current Time)' : ''}
          </span>
          <span className="text-slate-400">23:00 Night</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={selectedHour}
          onChange={(e) => setSelectedHour(Number(e.target.value))}
          className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          aria-label="Hour of the day scrubber"
        />

        {/* Quick Hour Pill Buttons */}
        <div className="flex justify-between gap-1 overflow-x-auto no-scrollbar pt-1">
          {[0, 4, 7, 9, 12, 14, 17, 19, 21].map((hr) => (
            <button
              key={hr}
              onClick={() => setSelectedHour(hr)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono transition ${
                selectedHour === hr
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : hr >= 12 && hr <= 15
                  ? 'bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {hr.toString().padStart(2, '0')}:00 {hr === 13 ? '☀️ Clean' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber Status Display Card */}
      <div className={`p-4 rounded-xl border ${theme.badgeBg} ${theme.borderColor} transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Atmospheric State & Hour */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 uppercase ${atmosphericState.badgeColor}`}>
                {atmosphericState.icon}
                {atmosphericState.title}
              </span>
              {selectedPoint.isCleanWindow && (
                <span className="text-[10px] font-extrabold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30 animate-pulse">
                  🌟 Safe Clean Window
                </span>
              )}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
              {atmosphericState.description}
            </p>

            <div className="pt-2 text-xs text-white font-medium flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>{atmosphericState.activityAdvisory}</span>
            </div>
          </div>

          {/* Right: Metrics at this hour */}
          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 uppercase block">Expected AQI</span>
              <span className={`text-2xl font-black ${theme.textColor}`}>
                {selectedPoint.aqi}
              </span>
              <span className="text-[9px] text-slate-400 block">{theme.category}</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 uppercase block">PM2.5 Level</span>
              <span className="text-2xl font-black text-white">
                {selectedPoint.pm25}
              </span>
              <span className="text-[9px] text-slate-400 block">µg/m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
