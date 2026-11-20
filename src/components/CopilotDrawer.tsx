import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  Minimize2,
  Maximize2
} from 'lucide-react';
import { AirQualityMetrics, InversionRisk, UserContext, CopilotMessage } from '../types';
import { queryGeminiCopilot } from '../services/geminiService';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: AirQualityMetrics;
  inversion: InversionRisk;
  userContext: UserContext;
  apiKey: string;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

const CONTEXT_PILLS = [
  'How to protect my infant during this AQI spike?',
  'How do I build a $35 Corsi-Rosenthal filter?',
  'When is the clean ventilation window today?',
  'What is the cleanest commute route for 14km?',
  'How to seal window drafts without spending money?',
];

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  inversion,
  userContext,
  apiKey,
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 🌿 Hello! I am your BreatheWise AI Copilot.

Tracking real-time conditions in **${metrics.locationName}**:
- **AQI**: ${metrics.aqi} (${metrics.category})
- **PM2.5**: ${metrics.pm25} µg/m³
- **Thermal Inversion**: ${inversion.severity} Risk
- **Clean Window**: ${inversion.cleanAirWindow.start} – ${inversion.cleanAirWindow.end}

Your family profile (${userContext.family.infants} infant, ${userContext.family.children} children, ${userContext.family.respiratoryVulnerable} sensitive) is actively loaded. How can I assist you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    setInput('');

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await queryGeminiCopilot(
        textToSend,
        metrics,
        inversion,
        userContext,
        apiKey
      );

      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: response.suggestedFollowUps,
        impactHighlight: response.impactHighlight,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errBotMsg: CopilotMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an issue formulating guidance. Please retry or verify your network connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errBotMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className={`bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl transition-all duration-300 ${
          isExpanded ? 'w-full md:w-3/4 lg:w-3/5' : 'w-full sm:w-[480px]'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="copilot-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 id="copilot-drawer-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                BreatheWise Copilot
                <span className="text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  {apiKey ? 'Gemini 1.5 Live' : 'Domain AI'}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                {metrics.locationName} • AQI {metrics.aqi} • {inversion.severity} Inversion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition hidden sm:block"
              title={isExpanded ? 'Collapse width' : 'Expand width'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close copilot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  isUser
                    ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-tl-none space-y-2'
                }`}>
                  <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                    {msg.content}
                  </div>

                  {msg.impactHighlight && (
                    <div className="mt-2.5 p-2 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between text-[10px]">
                      <span className="text-teal-300 font-bold">
                        {msg.impactHighlight.metric}: {msg.impactHighlight.value}
                      </span>
                      <span className="text-slate-400">{msg.impactHighlight.meaning}</span>
                    </div>
                  )}

                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Follow-Up Prompts:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedFollowUps.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(prompt)}
                            className="text-[10px] bg-slate-700/60 hover:bg-slate-700 text-teal-300 px-2 py-0.5 rounded border border-slate-600/50 transition text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 ${isUser ? 'text-slate-800' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-4 h-4 text-teal-400 animate-spin" />
              <span>Analyzing inversion boundary and pulmonary guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2 border-t border-slate-800 bg-slate-900/60 flex gap-1.5 overflow-x-auto no-scrollbar">
          {CONTEXT_PILLS.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill)}
              className="text-[10px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Drawer Input */}
        <div className="p-3 border-t border-slate-800 bg-slate-850 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about indoor hacks, infant safety, or commute..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold transition shadow"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
