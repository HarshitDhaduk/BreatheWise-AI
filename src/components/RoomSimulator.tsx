import React, { useState } from 'react';
import { 
  Home, 
  Baby, 
  Bed, 
  Tv, 
  ChefHat, 
  Wrench, 
  Sparkles
} from 'lucide-react';
import { AirQualityMetrics, IAQHackItem } from '../types';
import { IAQ_HACKS_DATABASE } from '../data/iaqHacksData';
import { getAQITheme } from '../utils/aqiCalculator';

interface RoomSimulatorProps {
  metrics: AirQualityMetrics;
  onOpenCopilot: (query: string) => void;
}

interface RoomConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  baselineInfiltrationRate: number; // 0.65 = 65% of outdoor PM2.5 leaks in
  applicableHacks: {
    hackId: string;
    label: string;
    costUSD: number;
    reductionMultiplier: number; // 0.15 = reduces remaining PM2.5 by 85%
  }[];
}

const ROOMS: RoomConfig[] = [
  {
    id: 'nursery',
    name: 'Infant Nursery / Kids Room',
    icon: <Baby className="w-4 h-4 text-pink-400" />,
    description: 'High-priority sanctuary room. Infants inhale 50% more air per lb than adults.',
    baselineInfiltrationRate: 0.65,
    applicableHacks: [
      { hackId: 'corsi-rosenthal-box', label: 'Corsi-Rosenthal Box ($35 DIY Purifier)', costUSD: 35, reductionMultiplier: 0.12 },
      { hackId: 'draft-sealing-positive-pressure', label: 'EPDM Window Weatherstripping & Draft Snake', costUSD: 8, reductionMultiplier: 0.45 },
      { hackId: 'nasa-botanical-air-sanctuary', label: 'Snake Plant (Nocturnal O₂ Replenishment)', costUSD: 15, reductionMultiplier: 0.85 },
      { hackId: 'diy-activated-carbon-voc-sleeve', label: 'Activated Carbon Pre-filter Sleeve', costUSD: 10, reductionMultiplier: 0.70 },
    ],
  },
  {
    id: 'master_bedroom',
    name: 'Master Bedroom',
    icon: <Bed className="w-4 h-4 text-indigo-400" />,
    description: 'Night recovery zone. Lungs heal and clear bronchial particulates during 8 hours of sleep.',
    baselineInfiltrationRate: 0.60,
    applicableHacks: [
      { hackId: 'corsi-rosenthal-box', label: 'Corsi-Rosenthal Box on Quiet Speed 1', costUSD: 35, reductionMultiplier: 0.14 },
      { hackId: 'draft-sealing-positive-pressure', label: 'Window & Balcony Door Draft Snake', costUSD: 8, reductionMultiplier: 0.50 },
      { hackId: 'radiant-heating-anti-smog', label: 'Clean Electric Oil-filled Radiator (Zero Smoke)', costUSD: 40, reductionMultiplier: 0.80 },
      { hackId: 'nasa-botanical-air-sanctuary', label: 'Areca Palm & Snake Plant Pair', costUSD: 15, reductionMultiplier: 0.85 },
    ],
  },
  {
    id: 'living_room',
    name: 'Living Room & Family Hall',
    icon: <Tv className="w-4 h-4 text-teal-400" />,
    description: 'Main family congregating area with large external balcony doors.',
    baselineInfiltrationRate: 0.70,
    applicableHacks: [
      { hackId: 'corsi-rosenthal-box', label: 'High-CADR (550 CFM) Box Fan Cube', costUSD: 35, reductionMultiplier: 0.15 },
      { hackId: 'draft-sealing-positive-pressure', label: 'Balcony Slider Weatherstrip & Sweep', costUSD: 8, reductionMultiplier: 0.55 },
      { hackId: 'nasa-botanical-air-sanctuary', label: 'NASA Botanical Sanctuary Trio', costUSD: 20, reductionMultiplier: 0.80 },
      { hackId: 'diy-activated-carbon-voc-sleeve', label: 'Activated Carbon Odor Sleeve', costUSD: 10, reductionMultiplier: 0.75 },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Dining Zone',
    icon: <ChefHat className="w-4 h-4 text-amber-400" />,
    description: 'Gas burners produce high NO₂ and oil aerosol spikes that must be exhausted safely.',
    baselineInfiltrationRate: 0.75,
    applicableHacks: [
      { hackId: 'kitchen-exhaust-pressure-hack', label: 'Safe Kitchen Makeup-Air Protocol (FREE)', costUSD: 0, reductionMultiplier: 0.35 },
      { hackId: 'draft-sealing-positive-pressure', label: 'Interior Kitchen Door Threshold Seal', costUSD: 8, reductionMultiplier: 0.65 },
      { hackId: 'diy-activated-carbon-voc-sleeve', label: 'Carbon Smoke & Grease Pre-Filter', costUSD: 10, reductionMultiplier: 0.60 },
    ],
  },
];

export const RoomSimulator: React.FC<RoomSimulatorProps> = ({
  metrics,
  onOpenCopilot,
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string>('nursery');
  const [activeHacks, setActiveHacks] = useState<Record<string, boolean>>({
    'corsi-rosenthal-box': true,
    'draft-sealing-positive-pressure': true,
    'nasa-botanical-air-sanctuary': false,
    'diy-activated-carbon-voc-sleeve': false,
    'kitchen-exhaust-pressure-hack': true,
    'radiant-heating-anti-smog': true,
  });

  const [activeDetailHack, setActiveDetailHack] = useState<IAQHackItem | null>(null);

  const room = ROOMS.find(r => r.id === activeRoomId) || ROOMS[0];

  // Calculate unmitigated indoor PM2.5
  const unmitigatedPM25 = Math.round(metrics.pm25 * room.baselineInfiltrationRate);
  
  // Calculate mitigated PM2.5 based on active hacks
  let currentPM25 = unmitigatedPM25;
  let totalCostUSD = 0;

  room.applicableHacks.forEach((h) => {
    if (activeHacks[h.hackId]) {
      currentPM25 *= h.reductionMultiplier;
      totalCostUSD += h.costUSD;
    }
  });

  currentPM25 = Math.max(8, Math.round(currentPM25));
  const indoorAQI = Math.round(currentPM25 * 1.6);
  const indoorTheme = getAQITheme(indoorAQI);
  const percentReduction = Math.round(((unmitigatedPM25 - currentPM25) / unmitigatedPM25) * 100);

  const toggleHack = (hackId: string) => {
    setActiveHacks(prev => ({
      ...prev,
      [hackId]: !prev[hackId],
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-1">
            <Home className="w-3.5 h-3.5" />
            Interactive Home Air Defense Simulator
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Simulate Indoor Air Quality Room-by-Room
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            See how inexpensive DIY hacks like Corsi-Rosenthal boxes ($35) transform indoor smog into crisp hospital-grade air.
          </p>
        </div>

        <button
          onClick={() => onOpenCopilot(`Guide me through setting up low-cost air filtration for my ${room.name} in ${metrics.locationName}`)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Ask Room Specialist
        </button>
      </div>

      {/* Room Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRoomId(r.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              activeRoomId === r.id
                ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            {r.icon}
            <span>{r.name}</span>
          </button>
        ))}
      </div>

      {/* Interactive Simulator Grid: Left Controls, Right Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Hack Toggles (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <span className="text-xs font-bold text-white block mb-0.5">{room.name}</span>
            <p className="text-[11px] text-slate-300">{room.description}</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Available Low-Cost DIY Defense Hacks:
            </span>

            <div className="space-y-2.5">
              {room.applicableHacks.map((h) => {
                const isChecked = !!activeHacks[h.hackId];
                const fullHackData = IAQ_HACKS_DATABASE.find(d => d.id === h.hackId);

                return (
                  <div
                    key={h.hackId}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-teal-950/20 border-teal-500/40 text-teal-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleHack(h.hackId)}
                        className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-slate-700 border-slate-600 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">{h.label}</span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {h.costUSD === 0 ? 'FREE' : `Cost: ~$${h.costUSD} (vs $400 commercial purifier)`}
                        </span>
                      </div>
                    </label>

                    {fullHackData && (
                      <button
                        onClick={() => setActiveDetailHack(fullHackData)}
                        className="text-[11px] text-teal-400 hover:text-teal-300 px-2 py-1 rounded bg-slate-800/80 border border-slate-700 hover:border-teal-500/50 transition font-medium shrink-0 flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3" /> Blueprint
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Simulated Indoor Air Gauge (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-850 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Indoor Air Simulation
            </span>

            {/* Side-by-side: Before vs After */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Unmitigated Air</span>
                <span className="text-2xl font-black text-rose-400 block mt-0.5">{unmitigatedPM25}</span>
                <span className="text-[10px] text-slate-400">µg/m³ PM2.5</span>
              </div>

              <div className={`p-3 rounded-xl border text-center ${indoorTheme.badgeBg} ${indoorTheme.borderColor}`}>
                <span className="text-[10px] text-slate-400 block uppercase">With Active Hacks</span>
                <span className={`text-2xl font-black block mt-0.5 ${indoorTheme.textColor}`}>
                  {currentPM25}
                </span>
                <span className="text-[10px] text-slate-400">µg/m³ PM2.5</span>
              </div>
            </div>

            {/* Hero Indoor AQI Badge */}
            <div className={`p-4 rounded-xl border text-center ${indoorTheme.badgeBg} ${indoorTheme.borderColor}`}>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wide">
                Simulated Indoor AQI
              </span>
              <div className="flex items-baseline justify-center gap-2 my-1">
                <span className="text-4xl font-black text-white">{indoorAQI}</span>
                <span className={`text-sm font-bold ${indoorTheme.textColor}`}>
                  {indoorTheme.label}
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-bold block">
                🎉 -{percentReduction}% Particulate Infiltration Blocked
              </span>
            </div>
          </div>

          {/* Investment vs Benefit highlight */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span>Total Hacks Implemented:</span>
              <span className="font-bold text-white">${totalCostUSD}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Savings vs Commercial HEPA:</span>
              <span className="font-bold text-emerald-400">~${Math.max(0, 450 - totalCostUSD)} saved</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
              <span>Clean Air Delivery:</span>
              <span className="font-bold text-teal-400">550 m³/hr CADR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Detail Modal */}
      {activeDetailHack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-0.5">
                  DIY Blueprint & Instructions
                </span>
                <h3 className="text-base font-bold text-white">{activeDetailHack.title}</h3>
              </div>
              <button
                onClick={() => setActiveDetailHack(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-center flex items-center justify-around">
                <div>
                  <span className="text-[10px] text-slate-400 block">DIY Cost</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {activeDetailHack.estimatedCostUSD === 0 ? 'FREE' : `$${activeDetailHack.estimatedCostUSD}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CADR Rating</span>
                  <span className="font-bold text-teal-400 text-sm">{activeDetailHack.cadreEstimateM3h} m³/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">PM2.5 Cut</span>
                  <span className="font-bold text-blue-400 text-sm">-{activeDetailHack.pm25ReductionPercent}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase text-[11px] mb-1.5">Materials Required:</h4>
                <ul className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                  {activeDetailHack.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-slate-200">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase text-[11px] mb-1.5">Assembly Steps:</h4>
                <ol className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                  {activeDetailHack.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-200">
                      <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 text-[11px] text-slate-300">
                <strong className="text-teal-300 block mb-0.5">Scientific Reason:</strong>
                {activeDetailHack.scientificExplanation}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-850 flex justify-end">
              <button
                onClick={() => setActiveDetailHack(null)}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
