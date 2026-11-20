import { useState, useEffect } from 'react';
import { 
  CloudFog, 
  CalendarClock, 
  Wrench, 
  HeartPulse, 
  Users, 
  Bot, 
  Github,
  RefreshCw
} from 'lucide-react';

import { AirQualityMetrics, InversionRisk, DiurnalPoint, UserContext } from './types';
import { fetchLiveAirQuality, SMOG_LOCATIONS } from './services/airQualityService';
import { analyzeThermalInversion } from './utils/inversionEngine';

import { Header } from './components/Header';
import { SmogDashboard } from './components/SmogDashboard';
import { RoutineOptimizer } from './components/RoutineOptimizer';
import { IAQLab } from './components/IAQLab';
import { ImpactDashboard } from './components/ImpactDashboard';
import { CommunityHub } from './components/CommunityHub';
import { GenAICopilot } from './components/GenAICopilot';
import { EmergencySmogBanner } from './components/EmergencySmogBanner';
import { FamilyProfileModal } from './components/FamilyProfileModal';
import { SettingsModal } from './components/SettingsModal';

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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'routine' | 'iaq_lab' | 'impact' | 'community' | 'copilot'>('dashboard');
  const [emergencyMode, setEmergencyMode] = useState(false);
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
    setActiveTab('copilot');
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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

        {/* Navigation Tabs Bar */}
        <nav 
          aria-label="Main Navigation"
          className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar shadow-lg"
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CloudFog className="w-4 h-4" />
            <span>Smog & Inversion</span>
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'routine'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Daily Routines</span>
          </button>

          <button
            onClick={() => setActiveTab('iaq_lab')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'iaq_lab'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Indoor Hacks & Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'impact'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Impact & Savings</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ml-auto ${
              activeTab === 'copilot'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>GenAI Copilot</span>
          </button>
        </nav>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <SmogDashboard
            metrics={metrics}
            inversion={inversion}
            diurnal={diurnal}
            onOpenIAQHacks={() => setActiveTab('iaq_lab')}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineOptimizer
            userContext={userContext}
            metrics={metrics}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {activeTab === 'iaq_lab' && (
          <IAQLab onOpenCopilot={handleOpenCopilotWithQuery} />
        )}

        {activeTab === 'impact' && (
          <ImpactDashboard
            userContext={userContext}
            metrics={metrics}
            onOpenCopilot={handleOpenCopilotWithQuery}
          />
        )}

        {activeTab === 'community' && (
          <CommunityHub onOpenCopilot={handleOpenCopilotWithQuery} />
        )}

        {activeTab === 'copilot' && (
          <GenAICopilot
            metrics={metrics}
            inversion={inversion}
            userContext={userContext}
            apiKey={geminiApiKey}
            externalQuery={copilotQuery}
            onClearExternalQuery={() => setCopilotQuery('')}
          />
        )}
      </main>

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
    </div>
  );
}
export default App;
