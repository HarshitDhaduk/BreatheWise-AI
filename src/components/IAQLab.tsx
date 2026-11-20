import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  X, 
  CheckCircle, 
  ShieldCheck, 
  HelpCircle,
  Layers,
  Leaf,
  Flame,
  Wind
} from 'lucide-react';
import { IAQHackItem } from '../types';
import { IAQ_HACKS_DATABASE } from '../data/iaqHacksData';

interface IAQLabProps {
  onOpenCopilot: (query: string) => void;
}

export const IAQLab: React.FC<IAQLabProps> = ({ onOpenCopilot }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeHack, setActiveHack] = useState<IAQHackItem | null>(null);

  const filteredHacks = selectedCategory === 'all'
    ? IAQ_HACKS_DATABASE
    : IAQ_HACKS_DATABASE.filter(h => h.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
              <Wrench className="w-3.5 h-3.5" />
              Low-Cost Indoor Air Quality (IAQ) Lab
            </span>
            <h3 className="text-xl font-bold text-white">
              Accessible, Low-Cost Home Clean Air Blueprints
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              You do not need expensive $500 purifiers to protect your family from severe winter smog. These scientifically validated DIY solutions clean indoor air for under $35.
            </p>
          </div>

          <button
            onClick={() => onOpenCopilot('Guide me through building a low-cost DIY air purifier for my apartment with step-by-step instructions')}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            DIY Purifier Assistant
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Hacks ({IAQ_HACKS_DATABASE.length})
          </button>
          <button
            onClick={() => setSelectedCategory('diy_filtration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              selectedCategory === 'diy_filtration'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> DIY Purifiers
          </button>
          <button
            onClick={() => setSelectedCategory('sealing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              selectedCategory === 'sealing'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Window Draft Sealing
          </button>
          <button
            onClick={() => setSelectedCategory('ventilation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              selectedCategory === 'ventilation'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Kitchen & Cooking
          </button>
          <button
            onClick={() => setSelectedCategory('heating_cooking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              selectedCategory === 'heating_cooking'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Clean Winter Heating
          </button>
          <button
            onClick={() => setSelectedCategory('plants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              selectedCategory === 'plants'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" /> Botanical Sanctuaries
          </button>
        </div>
      </div>

      {/* Grid of Hacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHacks.map((hack) => (
          <div
            key={hack.id}
            onClick={() => setActiveHack(hack)}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-teal-950/20"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  {hack.difficulty}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {hack.estimatedCostUSD === 0 ? 'FREE' : `$${hack.estimatedCostUSD} (₹${hack.estimatedCostINR.toLocaleString()})`}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                {hack.title}
              </h4>

              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {hack.scientificExplanation}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-teal-300">-{hack.pm25ReductionPercent}%</span>
                <span className="text-[11px] text-slate-400">Indoor PM2.5</span>
              </div>
              <span className="text-teal-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                View Blueprint &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activeHack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hack-title"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
                  DIY Blueprint & Protocol
                </span>
                <h3 id="hack-title" className="text-lg font-bold text-white">{activeHack.title}</h3>
              </div>
              <button
                onClick={() => setActiveHack(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Estimated Cost</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {activeHack.estimatedCostUSD === 0 ? 'FREE (Zero Cost)' : `$${activeHack.estimatedCostUSD} / ₹${activeHack.estimatedCostINR.toLocaleString()}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Clean Air Delivery (CADR)</span>
                  <span className="text-sm font-bold text-teal-400">{activeHack.cadreEstimateM3h} m³/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">PM2.5 Reduction</span>
                  <span className="text-sm font-bold text-blue-400">-{activeHack.pm25ReductionPercent}%</span>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                  Required Materials Checklist
                </h4>
                <ul className="space-y-1.5 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                  {activeHack.materials.map((mat, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-teal-400" />
                  Step-by-Step Assembly & Execution
                </h4>
                <ol className="space-y-2.5 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                  {activeHack.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Science & Why it works */}
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/20">
                <h4 className="font-bold text-teal-300 text-xs mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  The Environmental & Pulmonary Science
                </h4>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeHack.scientificExplanation}
                </p>
              </div>

              {/* Pro Tip */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-amber-300 mb-0.5">Engineer's Pro-Tip:</strong>
                  {activeHack.proTip}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenCopilot(`Give me personalized troubleshooting advice for: ${activeHack.title}`);
                  setActiveHack(null);
                }}
                className="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold text-xs flex items-center gap-1.5 border border-teal-500/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Ask Copilot About This Hack
              </button>

              <button
                onClick={() => setActiveHack(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
