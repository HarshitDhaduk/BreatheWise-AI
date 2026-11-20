import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  Sparkles,
  BedDouble,
  ShieldCheck
} from 'lucide-react';
import { AirQualityMetrics } from '../types';

interface EmergencySmogBannerProps {
  metrics: AirQualityMetrics;
  onClose: () => void;
  onOpenCopilot: (query: string) => void;
}

export const EmergencySmogBanner: React.FC<EmergencySmogBannerProps> = ({
  metrics,
  onClose,
  onOpenCopilot,
}) => {
  const [activeTab, setActiveTab] = useState<'sanctuary' | 'masks' | 'checklist'>('sanctuary');

  return (
    <div className="bg-gradient-to-b from-red-950/80 to-slate-900 border-2 border-red-600/70 rounded-2xl p-6 shadow-2xl shadow-red-950/50 mb-6 relative animate-fadeIn">
      {/* Top Banner Alert Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-wider text-red-400 bg-red-950 px-2.5 py-0.5 rounded border border-red-700">
                Severe Smog Emergency Protocol
              </span>
              <span className="text-xs font-bold text-white">AQI {metrics.aqi}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              Atmospheric Stagnation & Toxic Smog Lockdown
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCopilot(`Give me an emergency step-by-step action plan for my family during this AQI ${metrics.aqi} severe smog spike in ${metrics.locationName}`)}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Emergency Copilot Advice
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close emergency mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex gap-2 mt-4 pb-2">
        <button
          onClick={() => setActiveTab('sanctuary')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            activeTab === 'sanctuary' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BedDouble className="w-3.5 h-3.5" /> Bedroom Sanctuary Protocol
        </button>
        <button
          onClick={() => setActiveTab('masks')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            activeTab === 'masks' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Mask Scientific Guide
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            activeTab === 'checklist' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" /> Pediatric & Vulnerable Checklist
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-4 text-xs text-slate-200">
        {activeTab === 'sanctuary' && (
          <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-red-400" />
              How to Create a "Clean Air Bedroom Sanctuary"
            </h4>
            <p className="text-slate-300 leading-relaxed">
              When ambient AQI exceeds 300, whole-house purification fails due to draft leakage. Focus all filtration power on **one single enclosed bedroom**:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-white block mb-1">1. Door & Window Seal</span>
                <p className="text-slate-400 text-[11px]">Roll a damp towel or draft snake across the bottom of the bedroom door. Tape window sash seams with painter's tape.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-white block mb-1">2. Run Filter on High</span>
                <p className="text-slate-400 text-[11px]">Move all available purifiers or Corsi-Rosenthal boxes into this room. Run on maximum speed for 30 minutes, then lower to quiet speed.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-white block mb-1">3. Keep Infants & Seniors Inside</span>
                <p className="text-slate-400 text-[11px]">This sanctuary room will maintain PM2.5 below 20 µg/m³, allowing lungs to recover and bronchial inflammation to subside overnight.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'masks' && (
          <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Scientific Mask Comparison for Submicron Particulate Smog
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                  <span>N95 / FFP2 / KN95</span>
                  <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">95% Protection</span>
                </div>
                <p className="text-slate-300 text-[11px]">Electrostatically charged meltblown fabric traps submicron PM2.5 particles down to 0.3 microns. Dual headbands provide tight facial seal.</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
                <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                  <span>Surgical Blue Mask</span>
                  <span className="bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px]">~30% Protection</span>
                </div>
                <p className="text-slate-300 text-[11px]">Blocks coarse droplets and large dust, but perimeter air leaks allow up to 70% of fine PM2.5 soot to bypass the filter directly into airways.</p>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30">
                <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
                  <span>Cloth Mask / Scarf / Dupatta</span>
                  <span className="bg-rose-500/20 px-1.5 py-0.5 rounded text-[10px]">Near 0% Protection</span>
                </div>
                <p className="text-slate-300 text-[11px]">Woven cotton pore sizes (100–200 microns) are hundreds of times larger than PM2.5 (2.5 microns). Gives false psychological security without protection.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-2.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-400" />
              Emergency Vulnerability Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <label className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
                <input type="checkbox" defaultChecked className="rounded text-red-500" />
                <span>Keep rescue inhalers / bronchodilators within arm's reach</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
                <input type="checkbox" defaultChecked className="rounded text-red-500" />
                <span>Cancel morning outdoor sports/play for children under 12</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
                <input type="checkbox" defaultChecked className="rounded text-red-500" />
                <span>Verify senior family members take blood pressure medication on schedule</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
                <input type="checkbox" defaultChecked className="rounded text-red-500" />
                <span>Run saline eye drops and nasal flush to clear chemical irritants</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
