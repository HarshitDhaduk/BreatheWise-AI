import React, { useState } from 'react';
import { 
  Compass, 
  Train, 
  Bike, 
  Car, 
  Bus, 
  Leaf, 
  Sparkles,
  Info
} from 'lucide-react';
import { AirQualityMetrics, CommuteProfile } from '../types';
import { UG_PM25_PER_CIGARETTE } from '../utils/impactCalculator';

interface CommuteSimulatorProps {
  metrics: AirQualityMetrics;
  commute: CommuteProfile;
  onUpdateCommute: (updated: CommuteProfile) => void;
  onOpenCopilot: (query: string) => void;
}

export const CommuteSimulator: React.FC<CommuteSimulatorProps> = ({
  metrics,
  commute,
  onUpdateCommute,
  onOpenCopilot,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(commute.distanceKm || 12);
  const [selectedMode, setSelectedMode] = useState<string>(commute.mode || 'two_wheeler_petrol');
  const [shiftedTiming, setShiftedTiming] = useState<boolean>(true);
  const [woreMask, setWoreMask] = useState<boolean>(true);

  // Transit calculations
  const roundTripKm = distanceKm * 2;
  const transitMinutes = Math.round(distanceKm * 2.8);

  // Breathing volume during commute ~0.7 m3/hr
  const tripHours = (transitMinutes * 2) / 60;
  const breathingVolumeM3 = tripHours * 0.7;

  // Mode-specific baseline exposure multipliers
  let modeExposureMultiplier = 1.3;
  let co2PerKmGrams = 45; // petrol scooter
  let noxPerKmGrams = 0.35;
  let costPerTrip = 1.2;

  if (selectedMode === 'metro') {
    modeExposureMultiplier = 0.35;
    co2PerKmGrams = 18;
    noxPerKmGrams = 0.05;
    costPerTrip = 0.6;
  } else if (selectedMode === 'electric_bus') {
    modeExposureMultiplier = 0.48;
    co2PerKmGrams = 22;
    noxPerKmGrams = 0.08;
    costPerTrip = 0.4;
  } else if (selectedMode === 'car_solo') {
    modeExposureMultiplier = 0.65;
    co2PerKmGrams = 175;
    noxPerKmGrams = 0.65;
    costPerTrip = 4.5;
  } else if (selectedMode === 'carpool') {
    modeExposureMultiplier = 0.65;
    co2PerKmGrams = 55;
    noxPerKmGrams = 0.20;
    costPerTrip = 1.8;
  }

  // Adjust for mask & time shift
  let effectiveMultiplier = modeExposureMultiplier;
  if (shiftedTiming) effectiveMultiplier *= 0.75;
  if (woreMask) effectiveMultiplier *= 0.15;

  const inhaledPM25Ug = Math.round(metrics.pm25 * breathingVolumeM3 * effectiveMultiplier);
  const unmitigatedInhaledUg = Math.round(metrics.pm25 * breathingVolumeM3 * 1.3);
  const exposureAvoidedUg = Math.max(0, unmitigatedInhaledUg - inhaledPM25Ug);
  const cigsSaved = Math.round((exposureAvoidedUg / UG_PM25_PER_CIGARETTE) * 10) / 10;

  const totalCO2EmittedKg = Math.round((roundTripKm * co2PerKmGrams) / 100) / 10;
  const baselineCO2Kg = Math.round((roundTripKm * 175) / 100) / 10;
  const co2AvoidedKg = Math.max(0, Math.round((baselineCO2Kg - totalCO2EmittedKg) * 10) / 10);
  const noxAvoidedGrams = Math.max(0, Math.round(roundTripKm * (0.65 - noxPerKmGrams) * 10) / 10);

  const handleSelectMode = (mode: CommuteProfile['mode']) => {
    setSelectedMode(mode);
    onUpdateCommute({
      ...commute,
      mode,
      distanceKm,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-1">
            <Compass className="w-3.5 h-3.5" />
            Smog-Aware Transit Optimizer
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Commute Modal Shift & Route Exposure Calculator
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Compare public transit vs private vehicles to see your exact inhaled particulate reduction and community emissions savings.
          </p>
        </div>

        <button
          onClick={() => onOpenCopilot(`What is the cleanest and lowest emission commute route for a ${distanceKm} km trip in ${metrics.locationName}?`)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Ask Route Copilot
        </button>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Distance Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1.5">
              <span>One-Way Commute Distance:</span>
              <span className="text-teal-400 font-mono text-sm">{distanceKm} km ({roundTripKm} km daily round trip)</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2 km (Short)</span>
              <span>20 km (Average)</span>
              <span>40 km (Cross-City)</span>
            </div>
          </div>

          {/* Mode Selector Buttons */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Commute Mode:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleSelectMode('metro')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  selectedMode === 'metro'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Train className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-white">Underground Metro</span>
                  <span className="text-[10px] text-emerald-400">Filtered air (-65% soot)</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMode('electric_bus')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  selectedMode === 'electric_bus'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Bus className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-white">Electric Bus</span>
                  <span className="text-[10px] text-blue-300">Clean transit (-52% soot)</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMode('carpool')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  selectedMode === 'carpool'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-white">Carpool / Cab</span>
                  <span className="text-[10px] text-slate-300">AC Recirculate</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMode('two_wheeler_petrol')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  selectedMode === 'two_wheeler_petrol'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Bike className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-white">Two-Wheeler</span>
                  <span className="text-[10px] text-rose-400">Direct exhaust exposure</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectMode('car_solo')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
                  selectedMode === 'car_solo'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-white">Solo Petrol Car</span>
                  <span className="text-[10px] text-rose-400">High emission footprint</span>
                </div>
              </button>
            </div>
          </div>

          {/* Behavioral Levers */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
              shiftedTiming ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={shiftedTiming}
                onChange={(e) => setShiftedTiming(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
              <div>
                <span className="text-xs font-bold text-white block">35-Min Departure Shift</span>
                <span className="text-[10px] text-slate-300">Bypasses 8-9:30 AM peak soot</span>
              </div>
            </label>

            <label className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
              woreMask ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={woreMask}
                onChange={(e) => setWoreMask(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500"
              />
              <div>
                <span className="text-xs font-bold text-white block">Fitted N95 Respirator</span>
                <span className="text-[10px] text-slate-300">Filters 95% fine particles</span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Output Comparison Cards (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-850 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Trip Exposure & Impact Analysis
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Inhaled PM2.5</span>
              <span className="text-2xl font-black text-teal-400 block mt-0.5">{inhaledPM25Ug} µg</span>
              <span className="text-[10px] text-emerald-400 font-medium">-{exposureAvoidedUg} µg prevented</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Cigarettes Spared</span>
              <span className="text-2xl font-black text-emerald-400 block mt-0.5">{cigsSaved} cigs</span>
              <span className="text-[10px] text-slate-400">Berkeley Earth metric</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-200">
              <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                <Leaf className="w-3.5 h-3.5 text-teal-400" /> Community CO₂ Saved:
              </span>
              <span className="font-bold text-white font-mono">{co2AvoidedKg} kg CO₂</span>
            </div>

            <div className="flex items-center justify-between text-slate-200">
              <span className="text-slate-400">Respiratory NOx Avoided:</span>
              <span className="font-bold text-teal-400 font-mono">{noxAvoidedGrams} g</span>
            </div>

            <div className="flex items-center justify-between text-slate-200">
              <span className="text-slate-400">Estimated Transit Cost:</span>
              <span className="font-bold text-emerald-400 font-mono">${costPerTrip.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-200">
              <span className="text-slate-400">Est. Round-Trip Duration:</span>
              <span className="font-bold text-slate-300 font-mono">{transitMinutes * 2} mins</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong>Why Subway Metro Wins:</strong> Underground subway coaches run beneath the surface thermal inversion lid, and heavy ventilation intake filters strip out over 65% of roadway diesel particulates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
