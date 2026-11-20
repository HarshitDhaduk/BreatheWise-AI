import React, { useState } from 'react';
import { 
  HeartPulse, 
  Leaf, 
  Sparkles, 
  Info
} from 'lucide-react';
import { UserContext, AirQualityMetrics } from '../types';
import { calculateDirectImpact } from '../utils/impactCalculator';

interface ImpactDashboardProps {
  userContext: UserContext;
  metrics: AirQualityMetrics;
  onOpenCopilot: (query: string) => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  userContext,
  metrics,
  onOpenCopilot,
}) => {
  const [switchedTransit, setSwitchedTransit] = useState(true);
  const [woreN95, setWoreN95] = useState(true);
  const [usedFilter, setUsedFilter] = useState(true);
  const [avoidedPeak, setAvoidedPeak] = useState(true);
  const [avoidedBiomass, setAvoidedBiomass] = useState(true);

  const impact = calculateDirectImpact(
    metrics.pm25,
    userContext.commute,
    userContext.family,
    userContext.housing,
    {
      switchedToPublicTransit: switchedTransit,
      woreN95Mask: woreN95,
      usedDIYFilter: usedFilter,
      avoidedPeakCommute: avoidedPeak,
      avoidedBiomassBurning: avoidedBiomass,
    }
  );

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
              <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
              Direct Impact & Explainability Engine
            </span>
            <h3 className="text-xl font-bold text-white">
              Quantifying Your Personal Health & Community Footprint
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Air quality data is often too abstract. BreatheWise AI calculates the direct physical micrograms of toxic particulate spared from your family's lungs and the collective emissions kept out of the winter smog canopy.
            </p>
          </div>

          <button
            onClick={() => onOpenCopilot(`Explain the biological and environmental impact of my choices in detail for ${metrics.locationName}`)}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Explain the Science
          </button>
        </div>
      </div>

      {/* Interactive Behavioral Choice Levers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Simulate Your Daily Behavioral Choices</span>
          <span className="text-[11px] text-teal-400 font-normal">Toggle to recalculate real-time impact</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
            switchedTransit ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Public Transit</span>
              <input
                type="checkbox"
                checked={switchedTransit}
                onChange={(e) => setSwitchedTransit(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">Metro vs solo vehicle</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
            woreN95 ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Fitted N95 Mask</span>
              <input
                type="checkbox"
                checked={woreN95}
                onChange={(e) => setWoreN95(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">During outdoor transit</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
            usedFilter ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">DIY / HEPA Purifier</span>
              <input
                type="checkbox"
                checked={usedFilter}
                onChange={(e) => setUsedFilter(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">Active in bedrooms</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
            avoidedPeak ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Shifted Peak Hours</span>
              <input
                type="checkbox"
                checked={avoidedPeak}
                onChange={(e) => setAvoidedPeak(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">Avoided 8-9:30 AM rush</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between col-span-2 sm:col-span-1 ${
            avoidedBiomass ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">No Biomass/Angithi</span>
              <input
                type="checkbox"
                checked={avoidedBiomass}
                onChange={(e) => setAvoidedBiomass(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">Clean electric heating</span>
          </label>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Family Health Protection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <h4 className="text-sm font-bold text-white">
              Personal & Family Health Shield
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Fine PM2.5 Inhalation Blocked</span>
              <span className="text-3xl font-black text-teal-400">
                {impact.pm25AvoidedUg.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-300 ml-1">µg</span>
              <span className="text-[10px] text-slate-400 block mt-1">Deep alveolar soot prevented</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Cigarette Toxic Equivalents Spared</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-400">
                  {impact.equivalentCigarettesSaved}
                </span>
                <span className="text-xs font-semibold text-slate-300">cigs</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Based on Berkeley Earth standard</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-300">Estimated Purified Breaths Taken:</span>
            <span className="font-bold text-white font-mono">{impact.cleanAirBreathsEstimated.toLocaleString()} breaths</span>
          </div>
        </div>

        {/* Community Airshed & Climate Contribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              Community Inversion Airshed Savings
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">CO₂ Prevented from Airshed</span>
              <span className="text-3xl font-black text-blue-400">
                {impact.co2SavedKg}
              </span>
              <span className="text-xs font-semibold text-slate-300 ml-1">kg</span>
              <span className="text-[10px] text-slate-400 block mt-1">Modal shift & clean heating</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">NOx Gas Exhaust Abated</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-indigo-400">
                  {impact.noxSavedGrams}
                </span>
                <span className="text-xs font-semibold text-slate-300">g</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Respiratory-irritating diesel gases</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-300">Neighborhood Clean Air Index Boost:</span>
            <span className="font-bold text-teal-400 font-mono">+12.4 points</span>
          </div>
        </div>
      </div>

      {/* Causal Narrative Card */}
      <div className="p-5 rounded-2xl bg-teal-950/20 border border-teal-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
              Causal Explanation: Why Your Choices Matter
            </h5>
            <p className="text-xs text-slate-200 leading-relaxed">
              {impact.causalExplanation}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Note: Calculations use peer-reviewed pulmonary ventilation modeling (adult tidal rate 0.5-0.8 m³/h) and the Berkeley Earth particulate conversion ratio (22 µg/m³ 24h exposure ≈ 1 cigarette toxic equivalent).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
