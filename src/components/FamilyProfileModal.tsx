import React, { useState } from 'react';
import { X, Users, Home, Compass, ShieldAlert, Check } from 'lucide-react';
import { UserContext, FamilyMembers, HousingProfile, CommuteProfile } from '../types';
import { assessFamilyVulnerability } from '../utils/vulnerabilityScorer';

interface FamilyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userContext: UserContext;
  onSaveContext: (newContext: UserContext) => void;
}

export const FamilyProfileModal: React.FC<FamilyProfileModalProps> = ({
  isOpen,
  onClose,
  userContext,
  onSaveContext,
}) => {
  const [activeTab, setActiveTab] = useState<'family' | 'housing' | 'commute'>('family');
  const [family, setFamily] = useState<FamilyMembers>(userContext.family);
  const [housing, setHousing] = useState<HousingProfile>(userContext.housing);
  const [commute, setCommute] = useState<CommuteProfile>(userContext.commute);

  if (!isOpen) return null;

  const assessment = assessFamilyVulnerability(family, housing, commute);

  const handleSave = () => {
    onSaveContext({
      family,
      housing,
      commute,
      vulnerabilityScore: assessment.score,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-white">Family Vulnerability & Context Engine</h2>
              <p className="text-xs text-slate-400">Tailors low-emission routines and indoor hacks to your household profile.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Vulnerability Score Pill */}
        <div className="bg-slate-850 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-400" />
            <span className="text-slate-300 font-medium">Household Vulnerability Index:</span>
            <span className={`font-extrabold px-2 py-0.5 rounded ${
              assessment.score >= 3.5 ? 'bg-rose-500/20 text-rose-300' :
              assessment.score >= 2.2 ? 'bg-amber-500/20 text-amber-300' :
              'bg-emerald-500/20 text-emerald-300'
            }`}>
              {assessment.score} / 5.0 ({assessment.tier})
            </span>
          </div>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            {assessment.riskFactors.length} risk factor(s) identified
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6">
          <button
            onClick={() => setActiveTab('family')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'family'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Family Members
          </button>
          <button
            onClick={() => setActiveTab('housing')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'housing'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" /> Housing & Sealing
          </button>
          <button
            onClick={() => setActiveTab('commute')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'commute'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" /> Commute & Routine
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'family' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Children and respiratory-sensitive individuals require lower exposure limits. Adjust your household composition:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-white block">Infants & Toddlers (&lt;2 yrs)</span>
                    <span className="text-[11px] text-slate-400">High ventilation rate relative to weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFamily(f => ({ ...f, infants: Math.max(0, f.infants - 1) }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >-</button>
                    <span className="w-6 text-center text-sm font-bold text-teal-400">{family.infants}</span>
                    <button 
                      onClick={() => setFamily(f => ({ ...f, infants: f.infants + 1 }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >+</button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-white block">School Children (2–12 yrs)</span>
                    <span className="text-[11px] text-slate-400">Exposed during morning transit & play</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFamily(f => ({ ...f, children: Math.max(0, f.children - 1) }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >-</button>
                    <span className="w-6 text-center text-sm font-bold text-teal-400">{family.children}</span>
                    <button 
                      onClick={() => setFamily(f => ({ ...f, children: f.children + 1 }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >+</button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-white block">Asthma / COPD Vulnerable</span>
                    <span className="text-[11px] text-slate-400">Direct airway spasm sensitivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFamily(f => ({ ...f, respiratoryVulnerable: Math.max(0, f.respiratoryVulnerable - 1) }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >-</button>
                    <span className="w-6 text-center text-sm font-bold text-rose-400">{family.respiratoryVulnerable}</span>
                    <button 
                      onClick={() => setFamily(f => ({ ...f, respiratoryVulnerable: f.respiratoryVulnerable + 1 }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >+</button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-white block">Elderly Seniors (65+ yrs)</span>
                    <span className="text-[11px] text-slate-400">Cardiovascular & stroke vulnerability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFamily(f => ({ ...f, elderly: Math.max(0, f.elderly - 1) }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >-</button>
                    <span className="w-6 text-center text-sm font-bold text-teal-400">{family.elderly}</span>
                    <button 
                      onClick={() => setFamily(f => ({ ...f, elderly: f.elderly + 1 }))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'housing' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Housing Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHousing(h => ({ ...h, type: 'apartment' }))}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition ${
                      housing.type === 'apartment'
                        ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    🏢 Multi-Story Apartment
                  </button>
                  <button
                    type="button"
                    onClick={() => setHousing(h => ({ ...h, type: 'independent_house' }))}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition ${
                      housing.type === 'independent_house'
                        ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    🏡 Independent Ground House
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Window & Door Draft Sealing</label>
                <select
                  value={housing.windowSealing}
                  onChange={(e) => setHousing(h => ({ ...h, windowSealing: e.target.value as any }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="drafty">Drafty (Air gaps around sashes, cold drafts noticeable)</option>
                  <option value="moderate">Moderate (Standard window latch, occasional leakage)</option>
                  <option value="airtight">Airtight (Double glazed or weatherstripped foam seals)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Winter Heating Method</label>
                <select
                  value={housing.heatingType}
                  onChange={(e) => setHousing(h => ({ ...h, heatingType: e.target.value as any }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="electric_radiator">Electric Oil-filled Radiator (Clean, Zero Emissions)</option>
                  <option value="reverse_cycle_ac">Reverse Cycle Inverter AC (Heat Pump - High Efficiency)</option>
                  <option value="gas_heater">Unvented Gas / LPG Heater (Releases NO2)</option>
                  <option value="wood_fire">Fireplace / Wood Brazier / Angithi (Severe Particulate Smoke)</option>
                  <option value="blankets_only">Thermal Blankets / Passive Warmth</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <div>
                  <span className="text-xs font-semibold text-white block">Active Air Purifier in Home?</span>
                  <span className="text-[11px] text-slate-400">HEPA filter or DIY Corsi-Rosenthal Box active</span>
                </div>
                <input 
                  type="checkbox"
                  checked={housing.hasPurifier}
                  onChange={(e) => setHousing(h => ({ ...h, hasPurifier: e.target.checked }))}
                  className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'commute' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Commute Mode</label>
                <select
                  value={commute.mode}
                  onChange={(e) => setCommute(c => ({ ...c, mode: e.target.value as any }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="metro">🚇 Underground Metro / Electric Train (Best Air Filtered)</option>
                  <option value="electric_bus">🚌 Electric Bus (Public Transit)</option>
                  <option value="ice_bus">🚌 Standard City Bus</option>
                  <option value="carpool">🚗 Carpool / Shared Cab</option>
                  <option value="car_solo">🚗 Private Car (Solo Driving)</option>
                  <option value="two_wheeler_petrol">🛵 Two-Wheeler / Motorbike (Petrol - Direct Exhaust Exposure)</option>
                  <option value="ev_two_wheeler">⚡ Electric Scooter / EV Two-Wheeler</option>
                  <option value="walk_cycle">🚶 Walking / Bicycle (High Physical Inhalation Rate)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  One-Way Commute Distance: <span className="text-teal-400 font-bold">{commute.distanceKm} km</span>
                </label>
                <input 
                  type="range"
                  min="2"
                  max="45"
                  step="1"
                  value={commute.distanceKm}
                  onChange={(e) => setCommute(c => ({ ...c, distanceKm: Number(e.target.value) }))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>2 km</span>
                  <span>20 km</span>
                  <span>45 km</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Morning Departure</label>
                  <input 
                    type="time"
                    value={commute.typicalDepartureTime}
                    onChange={(e) => setCommute(c => ({ ...c, typicalDepartureTime: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Evening Return</label>
                  <input 
                    type="time"
                    value={commute.typicalReturnTime}
                    onChange={(e) => setCommute(c => ({ ...c, typicalReturnTime: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Stored locally in your browser. Never shared with third parties.
          </span>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-teal-500/20"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
