import React, { useState } from 'react';
import { 
  Activity, 
  Baby, 
  Wind, 
  Train, 
  Flame, 
  Moon, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { AirQualityMetrics, InversionRisk, UserContext } from '../types';

interface ActionMatrixProps {
  metrics: AirQualityMetrics;
  inversion: InversionRisk;
  userContext: UserContext;
  onOpenCopilot: (query: string) => void;
}

interface ActionItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  status: 'Safe' | 'Caution' | 'High Risk' | 'Prohibited';
  statusColor: string;
  statusBg: string;
  summary: string;
  detailedProtocol: string[];
  exposureImpact: string;
  emissionImpact: string;
  scientificReason: string;
  copilotPrompt: string;
}

export const ActionMatrix: React.FC<ActionMatrixProps> = ({
  metrics,
  inversion,
  userContext,
  onOpenCopilot,
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  const isSevere = metrics.aqi >= 200;
  const isHazardous = metrics.aqi >= 300;

  const actions: ActionItem[] = [
    {
      id: 'exercise',
      title: 'Morning Outdoor Exercise & Jogging',
      category: 'Fitness & Recreation',
      icon: <Activity className="w-5 h-5 text-rose-400" />,
      status: isHazardous ? 'Prohibited' : isSevere ? 'High Risk' : 'Caution',
      statusColor: isHazardous ? 'text-red-400' : isSevere ? 'text-orange-400' : 'text-amber-400',
      statusBg: isHazardous ? 'bg-red-500/10 border-red-500/20' : isSevere ? 'bg-orange-500/10 border-orange-500/20' : 'bg-amber-500/10 border-amber-500/20',
      summary: isSevere 
        ? 'Strictly avoid outdoor cardio. Cold morning inversion traps toxic PM2.5 at chest height.'
        : 'Limit outdoor exertion. Moderate particulate levels will irritate bronchial airways.',
      detailedProtocol: [
        'Shift cardio workouts indoors: use jump rope, yoga, or indoor resistance training in a room with active filtration.',
        `If you must run outdoors, wait until the solar clean-air window (${inversion.cleanAirWindow.start} - ${inversion.cleanAirWindow.end}) when the inversion breaks.`,
        'Never jog along arterial roadways or flyovers where diesel particulate concentration is 3-5x higher.',
        'Drink warm fluids and perform a saline nasal rinse after any outdoor exertion.',
      ],
      exposureImpact: `Prevents inhaling ~180-240 µg of PM2.5 (equivalent to sparing 1.0 cigarette per 45-min run).`,
      emissionImpact: `Indoor workout emits 0g outdoor pollutants.`,
      scientificReason: 'During heavy aerobic exertion, minute ventilation volume surges from 6 L/min to over 60 L/min, and mouth-breathing bypasses natural nasal mucosal filtration, driving ultrafine soot deep into alveoli.',
      copilotPrompt: `What are the best indoor cardio and aerobic exercises to maintain fitness during severe winter smog in ${metrics.locationName}?`,
    },
    {
      id: 'school_transit',
      title: 'School Transit & Children Play',
      category: 'Child & Infant Care',
      icon: <Baby className="w-5 h-5 text-amber-400" />,
      status: isHazardous ? 'Prohibited' : 'Caution',
      statusColor: isHazardous ? 'text-red-400' : 'text-amber-400',
      statusBg: isHazardous ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20',
      summary: `${userContext.family.infants > 0 ? `${userContext.family.infants} infant, ` : ''}${userContext.family.children} child(ren) in household: Require pediatric respiratory shielding.`,
      detailedProtocol: [
        'Cancel morning outdoor assembly, sports periods, and playground recess when AQI > 200.',
        'Commute in closed vehicles (school bus or carpool) with AC set strictly to "Cabin Internal Re-circulation".',
        'Avoid open two-wheeler, cycle-rickshaw, or walking commutes during peak morning fog (7:30 - 8:45 AM).',
        'Equip children (ages 3+) with pediatric-fitted N95/FFP2 masks with adjustable head-straps.',
      ],
      exposureImpact: `Reduces pediatric particulate inhalation by 70%, preventing acute asthma flare-ups and coughing fits.`,
      emissionImpact: `Coordinating a school carpool reduces 3-4 private vehicle trips, saving ~3.6 kg CO2 per day.`,
      scientificReason: 'Children breathe 50% more air per pound of body mass than adults, and their narrower bronchial pathways suffer irreversible alveolar damage when exposed to winter particulate spikes.',
      copilotPrompt: `How can I protect my children during school hours and transit when AQI is ${metrics.aqi} in ${metrics.locationName}?`,
    },
    {
      id: 'ventilation',
      title: 'Home Window Aeration & Fresh Air',
      category: 'Indoor Environment',
      icon: <Wind className="w-5 h-5 text-teal-400" />,
      status: 'Caution',
      statusColor: 'text-teal-400',
      statusBg: 'bg-teal-500/10 border-teal-500/20',
      summary: `Keep sealed right now. Only open during Clean-Air Window (${inversion.cleanAirWindow.start} - ${inversion.cleanAirWindow.end}).`,
      detailedProtocol: [
        `Keep all balcony doors and exterior windows firmly sealed during morning and night hours.`,
        `Set an alert for ${inversion.cleanAirWindow.start}: Open cross-ventilating windows for exactly 15 minutes to purge indoor CO2 and cooking moisture.`,
        `Re-seal windows completely by ${inversion.cleanAirWindow.end} before evening temperature inversion traps return.`,
        `Run indoor air filtration continuously on low speed to scrub remaining ambient ingress.`,
      ],
      exposureImpact: `Avoids letting in 300+ µg/m³ of ambient particulate soot while preventing indoor CO2 buildup > 2000 ppm.`,
      emissionImpact: `Passive solar ventilation uses zero electricity compared to continuous whole-house mechanical exhaust.`,
      scientificReason: 'Solar ground heating during midday causes convective thermals that lift the inversion lid, providing a brief 2-3 hour window where ground-level PM2.5 drops by 35-50%.',
      copilotPrompt: `Explain how the clean air ventilation window works today in ${metrics.locationName} and how to safely air out my home.`,
    },
    {
      id: 'commute',
      title: 'Workplace Commute & Route Mode',
      category: 'Daily Commute',
      icon: <Train className="w-5 h-5 text-blue-400" />,
      status: 'Caution',
      statusColor: 'text-blue-400',
      statusBg: 'bg-blue-500/10 border-blue-500/20',
      summary: `Your ${userContext.commute.distanceKm} km commute: Take Underground Metro instead of two-wheeler to cut exposure by 65%.`,
      detailedProtocol: [
        'Shift departure time by 30-40 minutes (e.g. depart after 9:30 AM or before 7:45 AM) to bypass dense diesel traffic jams.',
        'Switch from open two-wheeler or walking to an air-filtered Metro rail or electric bus.',
        'If driving, turn on AC Internal Re-circulation and check your vehicle\'s cabin PM2.5 filter.',
        'Wear a fitted N95 mask while walking through subway stations and bus terminals.',
      ],
      exposureImpact: `Prevents inhaling ~95 µg of raw black carbon and toxic tailpipe aerosols during transit.`,
      emissionImpact: `Taking Metro saves ~${(userContext.commute.distanceKm * 2 * 0.15).toFixed(1)} kg CO2 and 14g NOx compared to private driving.`,
      scientificReason: 'Roadway street canyons concentrate diesel exhaust, brake dust, and tire microplastics at road level. Metro underground cabins utilize continuous filtration that cuts passenger particulate exposure by up to two-thirds.',
      copilotPrompt: `How can I optimize my ${userContext.commute.distanceKm} km commute to minimize both smog exposure and vehicle emissions?`,
    },
    {
      id: 'cooking_heating',
      title: 'Cooking Fumes & Room Warmth',
      category: 'Home Energy',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      status: 'Caution',
      statusColor: 'text-amber-400',
      statusBg: 'bg-amber-500/10 border-amber-500/20',
      summary: 'Never use open biomass/angithi heaters. Use clean electric radiant heat & makeup kitchen air.',
      detailedProtocol: [
        'Strictly avoid burning coal, wood, or dung braziers (angithi)—they produce fatal levels of carbon monoxide and black carbon.',
        'Use an oil-filled electric radiator or reverse-cycle heat pump, coupled with heavy curtains to conserve warmth.',
        'When cooking with gas stoves, crack a window in the kitchen slightly so the exhaust fan doesn\'t create negative pressure and suck smog into bedrooms.',
        'Cover frying pans with lids to trap volatile oil aerosols and avoid high-heat deep frying during smog peaks.',
      ],
      exposureImpact: `Eliminates indoor PM2.5 spikes of 400-800 µg/m³ generated by unvented gas cooking and wood embers.`,
      emissionImpact: `Electric radiant heating avoids ~4.5 kg of CO2 and black carbon emissions per evening.`,
      scientificReason: 'Gas stoves release high concentrations of nitrogen dioxide (NO2) and carbon monoxide. In sealed winter homes, running an exhaust fan without a makeup air vent sucks outdoor smog through door cracks.',
      copilotPrompt: `What is the safest, zero-emission way to heat my apartment and cook during winter smog?`,
    },
    {
      id: 'sleep_sanctuary',
      title: 'Night Sleep & Bedroom Sanctuary',
      category: 'Rest & Recovery',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      status: 'Safe',
      statusColor: 'text-emerald-400',
      statusBg: 'bg-emerald-500/10 border-emerald-500/20',
      summary: 'Establish an airtight bedroom sanctuary to let respiratory airways heal during 8 hours of sleep.',
      detailedProtocol: [
        'Move your primary air purifier or DIY Corsi-Rosenthal box into the bedroom where you sleep.',
        'Place a weighted draft stopper or rolled damp towel along the bottom of the bedroom door.',
        'Keep the bedroom door closed; run the filter on high for 30 minutes before bed, then switch to quiet speed.',
        'Add a Snake Plant (Sansevieria) in the bedroom for nocturnal CAM-photosynthesis oxygen replenishment.',
      ],
      exposureImpact: `Maintains sleeping indoor PM2.5 < 15 µg/m³, giving lungs 8 hours of clinical recovery time.`,
      emissionImpact: `Concentrating filtration in a single room uses 75% less electricity than attempting to filter the entire house.`,
      scientificReason: 'During 8 hours of sleep, shallow breathing without environmental stressors allows lung macrophage clearance mechanisms to purge inhaled particulates from the upper airways.',
      copilotPrompt: `How do I set up a low-cost bedroom clean-air sanctuary for my family tonight?`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            What Can I Do Right Now? (Real-Time Decision Hub)
          </h3>
          <p className="text-xs text-slate-400">
            Instant, actionable recommendations tailored to current air quality ({metrics.aqi} AQI) and your family profile.
          </p>
        </div>
        <span className="text-[11px] text-teal-400 font-medium">Click any card for full protocol & impact math</span>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => setSelectedAction(act)}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-teal-950/20 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    {act.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {act.category}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${act.statusBg} ${act.statusColor}`}>
                  {act.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                {act.title}
              </h4>

              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                {act.summary}
              </p>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-mono text-[10px]">
                Impact: {act.exposureImpact.split('(')[0].trim()}
              </span>
              <span className="text-teal-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Action Plan <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Protocol Drawer Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {selectedAction.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      {selectedAction.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${selectedAction.statusBg} ${selectedAction.statusColor}`}>
                      {selectedAction.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedAction.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedAction(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              {/* Summary alert */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">Direct Advisory:</span>
                <p className="leading-relaxed">{selectedAction.summary}</p>
              </div>

              {/* Step-by-step checklist */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Recommended Action Steps
                </h4>
                <div className="space-y-2 bg-slate-800/30 p-3.5 rounded-xl border border-slate-700/50">
                  {selectedAction.detailedProtocol.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20">
                  <span className="text-[10px] font-bold text-teal-300 uppercase block mb-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-teal-400" /> Personal Lung Protection
                  </span>
                  <p className="text-[11px] text-slate-200">{selectedAction.exposureImpact}</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20">
                  <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-blue-400" /> Community Emission Cut
                  </span>
                  <p className="text-[11px] text-slate-200">{selectedAction.emissionImpact}</p>
                </div>
              </div>

              {/* Science reason */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400">
                <strong className="text-slate-300 block mb-0.5">Why this matters biologically:</strong>
                {selectedAction.scientificReason}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenCopilot(selectedAction.copilotPrompt);
                  setSelectedAction(null);
                }}
                className="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold text-xs flex items-center gap-1.5 border border-teal-500/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Ask Copilot for Details
              </button>

              <button
                onClick={() => setSelectedAction(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
