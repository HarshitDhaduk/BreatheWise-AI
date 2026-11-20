import React, { useState } from 'react';
import { 
  CalendarClock, 
  ShieldCheck, 
  Sparkles, 
  Train, 
  Clock, 
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { UserContext, AirQualityMetrics } from '../types';
import { calculateDirectImpact } from '../utils/impactCalculator';

interface RoutineOptimizerProps {
  userContext: UserContext;
  metrics: AirQualityMetrics;
  onOpenCopilot: (query: string) => void;
}

export const RoutineOptimizer: React.FC<RoutineOptimizerProps> = ({
  userContext,
  metrics,
  onOpenCopilot,
}) => {
  const [modalShiftActive, setModalShiftActive] = useState(true);
  const [timeShiftActive, setTimeShiftActive] = useState(true);
  const [maskActive, setMaskActive] = useState(true);

  const impact = calculateDirectImpact(
    metrics.pm25,
    userContext.commute,
    userContext.family,
    userContext.housing,
    {
      switchedToPublicTransit: modalShiftActive,
      woreN95Mask: maskActive,
      usedDIYFilter: userContext.housing.hasPurifier,
      avoidedPeakCommute: timeShiftActive,
      avoidedBiomassBurning: true,
    }
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
              <CalendarClock className="w-3.5 h-3.5" />
              Low-Emission Daily Routine Engine
            </span>
            <h3 className="text-xl font-bold text-white">
              Personalized Smog-Resilient Daily Schedule
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Tailored for your family ({userContext.family.infants} infant, {userContext.family.children} children, {userContext.family.respiratoryVulnerable} sensitive) and your {userContext.commute.distanceKm} km commute.
            </p>
          </div>

          <button
            onClick={() => onOpenCopilot(`Create a tailored low-emission morning and evening routine for my family in ${metrics.locationName} with AQI ${metrics.aqi}`)}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Ask Copilot to Customize
          </button>
        </div>
      </div>

      {/* Interactive Optimization Levers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Active Behavioral Adjustments
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setModalShiftActive(!modalShiftActive)}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
              modalShiftActive
                ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
            }`}
          >
            <Train className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
            <div>
              <span className="text-xs font-bold text-white block">Switch to Underground Metro</span>
              <span className="text-[11px] text-slate-300">Filters 65% of roadway soot & cuts CO₂</span>
            </div>
          </button>

          <button
            onClick={() => setTimeShiftActive(!timeShiftActive)}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
              timeShiftActive
                ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
            <div>
              <span className="text-xs font-bold text-white block">35-Min Departure Shift</span>
              <span className="text-[11px] text-slate-300">Bypasses peak morning inversion traffic</span>
            </div>
          </button>

          <button
            onClick={() => setMaskActive(!maskActive)}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
              maskActive
                ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
            <div>
              <span className="text-xs font-bold text-white block">Fitted N95 Outdoors</span>
              <span className="text-[11px] text-slate-300">Blocks 95% of fine submicron particles</span>
            </div>
          </button>
        </div>
      </div>

      {/* Routine Timeline Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline / High Exposure Routine */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Standard Baseline Routine
            </span>
            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              High Exposure & Emissions
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="font-mono text-slate-400 w-16">07:00 AM</span>
              <div>
                <strong className="text-slate-200 block">Morning outdoor jog & windows open</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Direct inhalation of stagnant nocturnal smog ceiling (~280 µg/m³).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="font-mono text-slate-400 w-16">08:15 AM</span>
              <div>
                <strong className="text-slate-200 block">School drop & commute via two-wheeler/car</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Children exposed directly to diesel bus tailpipes at breathing height.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="font-mono text-slate-400 w-16">01:00 PM</span>
              <div>
                <strong className="text-slate-200 block">Rooms kept sealed all day</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Indoor CO₂ levels climb past 1800 ppm, causing lethargy & headaches.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/40">
              <span className="font-mono text-slate-400 w-16">07:30 PM</span>
              <div>
                <strong className="text-slate-200 block">Unvented cooking & balcony wood heating</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Wood smoke concentrates black carbon in living rooms.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BreatheWise Optimized Routine */}
        <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 space-y-4 shadow-xl shadow-teal-950/20">
          <div className="flex items-center justify-between pb-3 border-b border-teal-500/20">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              BreatheWise Low-Emission Routine
            </span>
            <span className="text-[11px] font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
              Optimal Lung & Climate Protection
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-950/20 border border-teal-500/20">
              <span className="font-mono text-teal-300 font-bold w-16">07:00 AM</span>
              <div>
                <strong className="text-white block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Indoor yoga & sanctuary nursery seal
                </strong>
                <p className="text-slate-300 text-[11px] mt-0.5">Windows remain shut; DIY air purifier maintains indoor PM2.5 &lt; 25 µg/m³.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-950/20 border border-teal-500/20">
              <span className="font-mono text-teal-300 font-bold w-16">08:45 AM</span>
              <div>
                <strong className="text-white block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Filtered Metro transit with N95
                </strong>
                <p className="text-slate-300 text-[11px] mt-0.5">Departure shifted by 30 mins; subway cabin cuts inhaled soot by 65%.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-950/20 border border-teal-500/20">
              <span className="font-mono text-teal-300 font-bold w-16">01:15 PM</span>
              <div>
                <strong className="text-white block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 15-Minute Clean Window Aeration
                </strong>
                <p className="text-slate-300 text-[11px] mt-0.5">Midday solar mixing breaks the inversion lid. Purges indoor CO₂ safely.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-950/20 border border-teal-500/20">
              <span className="font-mono text-teal-300 font-bold w-16">07:30 PM</span>
              <div>
                <strong className="text-white block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Clean Electric Radiator & Makeup Air
                </strong>
                <p className="text-slate-300 text-[11px] mt-0.5">Isolated kitchen makeup vent; oil-filled radiator maintains zero-smoke warmth.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantified Direct Impact Highlight Box */}
      <div className="p-5 rounded-2xl bg-teal-950/30 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center justify-center sm:justify-start gap-1.5">
            <TrendingDown className="w-4 h-4 text-teal-400" />
            Quantified Direct Impact from this Routine
          </span>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {impact.causalExplanation}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30">
            <span className="text-lg font-black text-teal-400 block">{impact.pm25AvoidedUg.toLocaleString()} µg</span>
            <span className="text-[10px] text-slate-400">PM2.5 Avoided</span>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30">
            <span className="text-lg font-black text-emerald-400 block">{impact.equivalentCigarettesSaved}</span>
            <span className="text-[10px] text-slate-400">Cigarettes Spared</span>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30">
            <span className="text-lg font-black text-blue-400 block">{impact.co2SavedKg} kg</span>
            <span className="text-[10px] text-slate-400">CO₂ Abated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
