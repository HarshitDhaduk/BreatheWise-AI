import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Info
} from 'lucide-react';

interface MaskFitTesterProps {
  onOpenCopilot: (query: string) => void;
}

export const MaskFitTester: React.FC<MaskFitTesterProps> = ({ onOpenCopilot }) => {
  const [maskType, setMaskType] = useState<'n95_headstrap' | 'kn95_earloop' | 'surgical' | 'cloth'>('n95_headstrap');
  const [checks, setChecks] = useState<Record<string, boolean>>({
    step1: true,
    step2: true,
    step3: false,
    step4: false,
  });

  const toggleCheck = (key: string) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  let effectiveFiltrationPercent = 95;
  let verdictColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  let verdictText = 'Hospital-Grade Defense: 95% PM2.5 Blocked';

  if (maskType === 'n95_headstrap') {
    const passedAll = checks.step1 && checks.step2 && checks.step3 && checks.step4;
    effectiveFiltrationPercent = passedAll ? 95 : 68;
    if (!passedAll) {
      verdictColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      verdictText = 'Improper Seal: 32% Edge Leakage Risk';
    }
  } else if (maskType === 'kn95_earloop') {
    effectiveFiltrationPercent = checks.step2 && checks.step3 ? 82 : 55;
    verdictColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    verdictText = 'Moderate Seal: Ear loops limit perimeter tension';
  } else if (maskType === 'surgical') {
    effectiveFiltrationPercent = 28;
    verdictColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    verdictText = 'Poor Smog Defense: Perimeter Gaps Infiltrate 72% PM2.5';
  } else if (maskType === 'cloth') {
    effectiveFiltrationPercent = 6;
    verdictColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    verdictText = 'Ineffective: Woven pores are 50x larger than PM2.5';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Respiratory Shielding Protocol
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Interactive Mask Fit & Perimeter Seal Tester
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            A mask is only as effective as its facial perimeter seal. Test your fit to prevent submicron particulate bypass.
          </p>
        </div>

        <button
          onClick={() => onOpenCopilot('What are the best N95 masks for children and individuals with small facial profiles?')}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Ask Fit Specialist
        </button>
      </div>

      {/* Mask Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setMaskType('n95_headstrap')}
          className={`p-3 rounded-xl border text-left transition ${
            maskType === 'n95_headstrap'
              ? 'bg-teal-500/20 border-teal-400 text-teal-200'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs font-bold block text-white">N95 / FFP2 Headstrap</span>
          <span className="text-[10px] text-emerald-400">Gold Standard (Dual Bands)</span>
        </button>

        <button
          onClick={() => setMaskType('kn95_earloop')}
          className={`p-3 rounded-xl border text-left transition ${
            maskType === 'kn95_earloop'
              ? 'bg-teal-500/20 border-teal-400 text-teal-200'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs font-bold block text-white">KN95 Ear-Loop</span>
          <span className="text-[10px] text-blue-300">Comfortable (Moderate Seal)</span>
        </button>

        <button
          onClick={() => setMaskType('surgical')}
          className={`p-3 rounded-xl border text-left transition ${
            maskType === 'surgical'
              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs font-bold block text-white">3-Ply Surgical Blue</span>
          <span className="text-[10px] text-amber-400">High Leakage</span>
        </button>

        <button
          onClick={() => setMaskType('cloth')}
          className={`p-3 rounded-xl border text-left transition ${
            maskType === 'cloth'
              ? 'bg-rose-500/20 border-rose-400 text-rose-200'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs font-bold block text-white">Cloth / Bandana / Scarf</span>
          <span className="text-[10px] text-rose-400">Zero PM2.5 Defense</span>
        </button>
      </div>

      {/* Interactive 4-Step Seal Verification Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            4-Point Seal Verification Protocol:
          </span>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.step1}
              onChange={() => toggleCheck('step1')}
              className="w-4 h-4 rounded text-teal-500 mt-0.5"
            />
            <div className="text-xs">
              <strong className="text-white block">1. Crown & Neck Dual-Strap Positioning</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Top strap goes over the crown of the head; bottom strap rests below ears around the nape of neck.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.step2}
              onChange={() => toggleCheck('step2')}
              className="w-4 h-4 rounded text-teal-500 mt-0.5"
            />
            <div className="text-xs">
              <strong className="text-white block">2. Two-Finger Nose-Clip Molding</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Use both index fingertips to mold the metal strip firmly across the bridge of your nose. (Never pinch with one hand, which creates an air peak).</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.step3}
              onChange={() => toggleCheck('step3')}
              className="w-4 h-4 rounded text-teal-500 mt-0.5"
            />
            <div className="text-xs">
              <strong className="text-white block">3. Positive Pressure Seal Check (Gentle Exhale)</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Cup hands over mask face and exhale sharply. The mask should gently balloon. If air blows into your eyes, tighten the nose clip.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.step4}
              onChange={() => toggleCheck('step4')}
              className="w-4 h-4 rounded text-teal-500 mt-0.5"
            />
            <div className="text-xs">
              <strong className="text-white block">4. Negative Pressure Seal Check (Sharp Inhale)</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Inhale rapidly. The center of the respirator should cup inward slightly toward your lips without air rushing through the cheeks.</p>
            </div>
          </label>
        </div>

        {/* Real-time Verdict Output (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-850 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Seal Integrity Rating
          </span>

          <div className={`p-4 rounded-xl border text-center ${verdictColor}`}>
            <span className="text-3xl font-black block">{effectiveFiltrationPercent}%</span>
            <span className="text-xs font-bold block mt-1">{verdictText}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <Info className="w-4 h-4 text-teal-400" /> The Physics of Meltblown Polymers:
            </div>
            <p>
              Genuine N95/FFP2 respirators do not rely on simple mechanical sieve mesh. They use <strong>electrostatically charged meltblown polypropylene fibers</strong> that attract and capture neutral sub-micron particles down to 0.1–0.3 microns via electrostatic Brownian capture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
