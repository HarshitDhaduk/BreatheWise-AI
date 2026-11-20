import React from 'react';
import { 
  CloudFog, 
  Wind, 
  Thermometer, 
  Droplets, 
  Clock, 
  ShieldCheck, 
  AlertOctagon,
  Sparkles,
  Wrench
} from 'lucide-react';
import { AirQualityMetrics, InversionRisk, DiurnalPoint } from '../types';
import { getAQITheme } from '../utils/aqiCalculator';

interface SmogDashboardProps {
  metrics: AirQualityMetrics;
  inversion: InversionRisk;
  diurnal: DiurnalPoint[];
  onOpenIAQHacks: () => void;
  onOpenCopilot: (query: string) => void;
}

export const SmogDashboard: React.FC<SmogDashboardProps> = ({
  metrics,
  inversion,
  diurnal,
  onOpenIAQHacks,
  onOpenCopilot,
}) => {
  const theme = getAQITheme(metrics.aqi);
  const whoExceedanceMultiplier = Math.round((metrics.pm25 / 15) * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner: AQI Radial + Inversion Trap Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main AQI Display (7 Cols) */}
        <div className={`lg:col-span-7 rounded-2xl p-6 sm:p-8 border ${theme.badgeBg} ${theme.borderColor} relative overflow-hidden backdrop-blur-sm transition-all`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-900/60 border border-slate-700 text-slate-200">
                  <CloudFog className="w-3.5 h-3.5 text-teal-400" />
                  Live Air Quality Index
                </span>
                <span className="text-xs text-slate-400">Updated {metrics.timestamp}</span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-6xl sm:text-7xl font-black tracking-tight text-white">
                  {metrics.aqi}
                </span>
                <div className="space-y-0.5">
                  <span className={`text-xl sm:text-2xl font-bold block ${theme.textColor}`}>
                    {theme.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    US-EPA Standard | 0 - 500+ scale
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 mt-3 max-w-lg leading-relaxed">
                {theme.healthSummary}
              </p>

              {/* Mask & Activity Guidance Pill */}
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-200 font-medium">
                  {theme.maskRecommendation}
                </span>
              </div>
            </div>

            {/* PM2.5 Hero Meter Box */}
            <div className="w-full sm:w-auto bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:min-w-[190px] flex flex-col items-center justify-center text-center shadow-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Fine Particulate (PM2.5)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {metrics.pm25}
                </span>
                <span className="text-xs font-medium text-slate-400">µg/m³</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 w-full text-center">
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 block">
                  {whoExceedanceMultiplier}x WHO Safe Limit
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  WHO 24h limit is 15 µg/m³
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Atmospheric Inversion & Clean Air Window (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-850 bg-slate-900/80 rounded-2xl p-6 sm:p-7 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20">
                <AlertOctagon className="w-3.5 h-3.5" />
                Atmospheric Inversion Alert
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded uppercase ${
                inversion.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                inversion.severity === 'Severe' ? 'bg-orange-500/20 text-orange-400' :
                inversion.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {inversion.severity} Risk
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1.5">
              Winter Nocturnal Stagnation Trap
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {inversion.reason}
            </p>

            {/* Weather Sensor Readings */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <Thermometer className="w-3.5 h-3.5 text-teal-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-200 block">{metrics.temperature}°C</span>
                <span className="text-[10px] text-slate-400">Surface Temp</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <Droplets className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-200 block">{metrics.humidity}%</span>
                <span className="text-[10px] text-slate-400">Humidity</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <Wind className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-200 block">{metrics.windSpeed} km/h</span>
                <span className="text-[10px] text-slate-400">Stagnant Wind</span>
              </div>
            </div>
          </div>

          {/* Clean Air Window Recommendation */}
          <div className="mt-5 p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30">
            <div className="flex items-center justify-between text-xs font-bold text-teal-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Safe Clean-Air Ventilation Window
              </span>
              <span className="bg-teal-500/20 px-2 py-0.5 rounded text-teal-200">
                {inversion.cleanAirWindow.start} – {inversion.cleanAirWindow.end}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {inversion.cleanAirWindow.description}
            </p>
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-teal-500/20">
              <button
                onClick={onOpenIAQHacks}
                className="text-[11px] text-teal-300 hover:text-teal-200 flex items-center gap-1 font-semibold"
              >
                <Wrench className="w-3 h-3 text-teal-400" /> Indoor Hacks
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => onOpenCopilot(`What should I do during the clean air window (${inversion.cleanAirWindow.start} - ${inversion.cleanAirWindow.end})?`)}
                className="text-[11px] text-teal-300 hover:text-teal-200 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3 text-teal-400" /> Ask Timing Advice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Pollutants Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* PM10 */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">PM10 (Coarse)</div>
          <div className="text-xl font-bold text-white mt-1">{metrics.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Dust & vehicle friction</div>
        </div>

        {/* NO2 */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">NO₂ (Nitrogen Dioxide)</div>
          <div className="text-xl font-bold text-white mt-1">{metrics.no2} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Diesel tailpipe soot</div>
        </div>

        {/* Ozone */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">O₃ (Ground Ozone)</div>
          <div className="text-xl font-bold text-white mt-1">{metrics.o3} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Photochemical oxidant</div>
        </div>

        {/* CO */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">CO (Carbon Monoxide)</div>
          <div className="text-xl font-bold text-white mt-1">{metrics.co} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Biomass / incomplete fuel</div>
        </div>

        {/* SO2 */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SO₂ (Sulfur Dioxide)</div>
          <div className="text-xl font-bold text-white mt-1">{metrics.so2} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Industrial combustion</div>
        </div>
      </div>

      {/* 24-Hour Diurnal Timeline: Inversion Cycle */}
      <div className="p-6 rounded-2xl bg-slate-850 bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              24-Hour Winter Smog & Thermal Inversion Cycle
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice the high morning/night peaks trapped by cold air, and the midday convective clean-air window.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-teal-300">
              <span className="w-2.5 h-2.5 rounded bg-teal-500"></span>
              Clean Window (12-3 PM)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
              Inversion Trap Peak
            </span>
          </div>
        </div>

        {/* Timeline Bar Chart */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[650px] grid grid-cols-24 gap-1.5 items-end h-32 pt-4 px-1">
            {diurnal.slice(0, 24).map((pt, i) => {
              const heightPercent = Math.min(100, Math.max(15, (pt.pm25 / 350) * 100));
              const isClean = pt.isCleanWindow;
              const isPeak = pt.pm25 > 200;

              return (
                <div key={i} className="flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                    <span className="bg-slate-800 text-[10px] text-slate-100 px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
                      {pt.time}: {pt.pm25} µg/m³ (AQI {pt.aqi})
                    </span>
                  </div>

                  {/* Vertical bar */}
                  <div 
                    className={`w-full rounded-t transition-all group-hover:opacity-100 ${
                      isClean ? 'bg-teal-400/80 hover:bg-teal-300' :
                      isPeak ? 'bg-rose-500/80 hover:bg-rose-400' :
                      'bg-amber-400/80 hover:bg-amber-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>

                  {/* Hour label */}
                  <span className={`text-[9px] mt-1.5 font-mono ${isClean ? 'text-teal-400 font-bold' : 'text-slate-400'}`}>
                    {pt.time.slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
