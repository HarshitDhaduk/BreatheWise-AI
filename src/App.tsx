import { useState, useEffect } from 'react';
import { 
  CloudFog, 
  Bot, 
  Github, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';

import { AirQualityMetrics, InversionRisk, DiurnalPoint, UserContext } from './types';
import { fetchLiveAirQuality, SMOG_LOCATIONS } from './services/airQualityService';
import { analyzeThermalInversion } from './utils/inversionEngine';

import { Header } from './components/Header';
import { SmogDashboard } from './components/SmogDashboard';
import { ActionMatrix } from './components/ActionMatrix';
import { DayScrubber } from './components/DayScrubber';
import { RoomSimulator } from './components/RoomSimulator';
import { CommuteSimulator } from './components/CommuteSimulator';
import { CommunityHub } from './components/CommunityHub';
import { EmergencySmogBanner } from './components/EmergencySmogBanner';
import { FamilyProfileModal } from './components/FamilyProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { CopilotDrawer } from './components/CopilotDrawer';

const DEFAULT_USER_CONTEXT: UserContext = {
  family: {
    infants: 1,
    children: 1,
    adults: 2,
    elderly: 1,
    respiratoryVulnerable: 1,
  },
  housing: {
    type: 'apartment',
    floorLevel: 4,
    windowSealing: 'drafty',
    hasPurifier: false,
    cookingFuel: 'piped_gas',
    heatingType: 'electric_radiator',
  },
  commute: {
    mode: 'two_wheeler_petrol',
    distanceKm: 14,
    typicalDepartureTime: '08:30',
    typicalReturnTime: '18:30',
  },
  vulnerabilityScore: 3.8,
};

export function App() {
  const [selectedLocation, setSelectedLocation] = useState(SMOG_LOCATIONS[0]);
  const [metrics, setMetrics] = useState<AirQualityMetrics | null>(null);
  const [diurnal, setDiurnal] = useState<DiurnalPoint[]>([]);
  const [inversion, setInversion] = useState<InversionRisk | null>(null);
  const [loading, setLoading] = useState(true);

  // Active section view mode for smooth navigation
  const [activeSection, setActiveSection] = useState<'all' | 'actions' | 'rooms' | 'commute' | 'community'>('all');
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  // Copilot drawer state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState<string>('');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Context from LocalStorage
  const [userContext, setUserContext] = useState<UserContext>(() => {
    const saved = localStorage.getItem('breathewise_context');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_USER_CONTEXT;
  });

  // Gemini API Key from LocalStorage
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('breathewise_gemini_key') || '';
  });

  const loadAirData = async (loc = selectedLocation) => {
    setLoading(true);
    try {
      const data = await fetchLiveAirQuality(loc.latitude, loc.longitude, loc.name);
      setMetrics(data.metrics);
      setDiurnal(data.diurnal);

      const inv = analyzeThermalInversion({
        temperature: data.metrics.temperature,
        humidity: data.metrics.humidity,
        windSpeed: data.metrics.windSpeed,
        hourOfDay: new Date().getHours(),
        pm25: data.metrics.pm25,
      });
      setInversion(inv);

      // Auto-trigger emergency mode if AQI is hazardous (>300)
      if (data.metrics.aqi >= 300) {
        setEmergencyMode(true);
      }
    } catch (err) {
      console.error('Error fetching air quality:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAirData(selectedLocation);
  }, [selectedLocation]);

  const handleSaveContext = (newContext: UserContext) => {
    setUserContext(newContext);
    localStorage.setItem('breathewise_context', JSON.stringify(newContext));
  };

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('breathewise_gemini_key', key);
  };

  const handleOpenCopilotWithQuery = (query: string) => {
    setCopilotQuery(query);
    setIsCopilotOpen(true);
  };

  if (!metrics || !inversion) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 animate-pulse">
            <CloudFog className="w-8 h-8" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-300">
            Initializing BreatheWise Smog & Inversion Intelligence...
          </span>
        </div>
      </div>
    );
  }

  const currentHour = new Date().getHours();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <Header
        metrics={metrics}
        emergencyMode={emergencyMode}
        onToggleEmergency={() => setEmergencyMode(!emergencyMode)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        vulnerabilityScore={userContext.vulnerabilityScore}
        hasCustomKey={!!geminiApiKey}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Updating real-time inversion & AQI feeds...</span>
          </div>
        )}

        {/* Severe Smog Emergency Lockdown Banner */}
        {emergencyMode && (
          <EmergencySmogBanner
            metrics={metrics}
            onClose={() => setEmergencyMode(false)}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {/* Live Smog & Inversion Overview */}
        <SmogDashboard
          metrics={metrics}
          inversion={inversion}
          diurnal={diurnal}
          onOpenIAQHacks={() => setActiveSection('rooms')}
          onOpenCopilot={handleOpenCopilotWithQuery}
        />

        {/* Focus Navigation Bar (Lets user filter or view all seamlessly) */}
        <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSection === 'all'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Full Daily Copilot
            </button>
            <button
              onClick={() => setActiveSection('actions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSection === 'actions'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Decision Matrix
            </button>
            <button
              onClick={() => setActiveSection('rooms')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSection === 'rooms'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home Air Defense Lab
            </button>
            <button
              onClick={() => setActiveSection('commute')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSection === 'commute'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Commute Optimizer
            </button>
            <button
              onClick={() => setActiveSection('community')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSection === 'community'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Community Pledges
            </button>
          </div>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
        </div>

        {/* Section 1: "What Can I Do Right Now?" Action Matrix */}
        {(activeSection === 'all' || activeSection === 'actions') && (
          <ActionMatrix
            metrics={metrics}
            inversion={inversion}
            userContext={userContext}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {/* Section 2: 24-Hour Diurnal Inversion Scrubber */}
        {(activeSection === 'all' || activeSection === 'actions') && (
          <DayScrubber
            diurnal={diurnal}
            currentHour={currentHour}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {/* Section 3: Room-by-Room Home Air Defense Simulator */}
        {(activeSection === 'all' || activeSection === 'rooms') && (
          <RoomSimulator
            metrics={metrics}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {/* Section 4: Commute Modal Shift & Route Optimizer */}
        {(activeSection === 'all' || activeSection === 'commute') && (
          <CommuteSimulator
            metrics={metrics}
            commute={userContext.commute}
            onUpdateCommute={(c) => handleSaveContext({ ...userContext, commute: c })}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {/* Section 5: Community Airshed & Pledges */}
        {(activeSection === 'all' || activeSection === 'community') && (
          <CommunityHub onOpenCopilot={handleOpenCopilotWithQuery} />
        )}
      </main>

      {/* Floating Omnipresent Copilot Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-2xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition flex items-center gap-2.5 group"
        aria-label="Open BreatheWise AI Copilot"
      >
        <Bot className="w-6 h-6" />
        <span className="hidden md:inline text-xs font-black tracking-wide">
          Ask BreatheWise AI
        </span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
        </span>
      </button>

      {/* Slide-over Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        metrics={metrics}
        inversion={inversion}
        userContext={userContext}
        apiKey={geminiApiKey}
        initialQuery={copilotQuery}
        onClearInitialQuery={() => setCopilotQuery('')}
      />

      {/* Modals */}
      <FamilyProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userContext={userContext}
        onSaveContext={handleSaveContext}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={geminiApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">BreatheWise AI</span>
            <span>•</span>
            <span>Google PromptWars Challenge 6: Urban Air Quality Assistant</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/HarshitDhaduk/BreatheWise-AI"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
            <span>•</span>
            <span className="text-[11px] text-slate-400">
              WHO & US-EPA Grounded • Zero Telemetry
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
