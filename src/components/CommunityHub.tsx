import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  Flame, 
  Train, 
  Gift
} from 'lucide-react';
import { CommunityPledge } from '../types';
import { INITIAL_COMMUNITY_PLEDGES } from '../data/communityData';

interface CommunityHubProps {
  onOpenCopilot: (query: string) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ onOpenCopilot }) => {
  const [pledges, setPledges] = useState<CommunityPledge[]>(() => {
    const saved = localStorage.getItem('breathewise_pledges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_COMMUNITY_PLEDGES;
  });

  const togglePledge = (id: string) => {
    const updated = pledges.map(p => {
      if (p.id === id) {
        const nextState = !p.userPledged;
        return {
          ...p,
          userPledged: nextState,
          participantsCount: nextState ? p.participantsCount + 1 : p.participantsCount - 1,
        };
      }
      return p;
    });
    setPledges(updated);
    localStorage.setItem('breathewise_pledges', JSON.stringify(updated));
  };

  const totalParticipants = pledges.reduce((acc, p) => acc + p.participantsCount, 0);
  const totalCO2Saved = pledges.reduce((acc, p) => acc + (p.userPledged ? p.estimatedCommunityCO2SavedKg + 15 : p.estimatedCommunityCO2SavedKg), 0);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 mb-2">
              <Users className="w-3.5 h-3.5" />
              Community Airshed & Collective Action Hub
            </span>
            <h3 className="text-xl font-bold text-white">
              Neighborhood Action to Break the Smog Canopy
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Air is a shared commons. When whole neighborhoods take coordinated action—stopping waste burning, carpooling on high-inversion days, and donating DIY purifiers—the localized smog blanket lifts faster.
            </p>
          </div>

          <button
            onClick={() => onOpenCopilot('How can I organize a community clean-air initiative in my residential society or neighborhood?')}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Society Action Plan
          </button>
        </div>

        {/* Community Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Active Neighborhood Pledges</span>
            <span className="text-xl font-black text-teal-400">{totalParticipants.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Est. CO₂ Kept from Airshed</span>
            <span className="text-xl font-black text-emerald-400">{totalCO2Saved.toLocaleString()} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block uppercase">Corsi-Rosenthal Units Donated</span>
            <span className="text-xl font-black text-blue-400">512 units</span>
          </div>
        </div>
      </div>

      {/* Pledges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pledges.map((pledge) => (
          <div
            key={pledge.id}
            className={`rounded-2xl p-5 border transition flex flex-col justify-between ${
              pledge.userPledged
                ? 'bg-teal-950/20 border-teal-500/40'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  {pledge.category === 'waste' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                  {pledge.category === 'commute' && <Train className="w-3.5 h-3.5 text-blue-400" />}
                  {pledge.category === 'heating' && <Leaf className="w-3.5 h-3.5 text-emerald-400" />}
                  {pledge.category === 'neighborhood' && <Gift className="w-3.5 h-3.5 text-purple-400" />}
                  {pledge.category}
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  {pledge.participantsCount.toLocaleString()} neighbors joined
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">{pledge.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{pledge.description}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Saves ~{(pledge.estimatedCommunityCO2SavedKg / pledge.participantsCount).toFixed(1)} kg CO₂ per member
              </span>

              <button
                onClick={() => togglePledge(pledge.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  pledge.userPledged
                    ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {pledge.userPledged ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> You're Pledged
                  </>
                ) : (
                  'Take This Pledge'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
