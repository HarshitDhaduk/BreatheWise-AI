import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { AirQualityMetrics, InversionRisk, UserContext, CopilotMessage } from '../types';
import { queryGeminiCopilot } from '../services/geminiService';

interface GenAICopilotProps {
  metrics: AirQualityMetrics;
  inversion: InversionRisk;
  userContext: UserContext;
  apiKey: string;
  externalQuery?: string;
  onClearExternalQuery?: () => void;
}

const PRESET_PROMPTS = [
  'How to protect my 1-year-old infant and asthmatic child today?',
  'Step-by-step Corsi-Rosenthal DIY air purifier instructions',
  'When is the clean ventilation window to air out my home today?',
  'Optimal commute shift to avoid morning inversion & diesel soot',
  'How do I seal drafty windows to stop winter smog leakage?',
];

export const GenAICopilot: React.FC<GenAICopilotProps> = ({
  metrics,
  inversion,
  userContext,
  apiKey,
  externalQuery,
  onClearExternalQuery,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 🌿 Hello! I am your BreatheWise AI Copilot.

I am actively tracking real-time air quality in **${metrics.locationName}** (AQI **${metrics.aqi}** - **${metrics.category}**) with a **${inversion.severity} Winter Inversion Risk**.

How can I help protect your household (${userContext.family.infants} infant, ${userContext.family.children} children, ${userContext.family.respiratoryVulnerable} respiratory sensitive) today? Select a prompt below or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'How to protect my children during today\'s smog?',
        'How do I build a $35 Corsi-Rosenthal box?',
        'What is the clean ventilation window today?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle external queries sent from other components (e.g. "Ask Copilot")
  useEffect(() => {
    if (externalQuery) {
      handleSend(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

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
      const errorMsg: CopilotMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an unexpected error while formulating guidance. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              BreatheWise AI Copilot
              {apiKey ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Gemini API Connected
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  Local Smog Intelligence Engine
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded in atmospheric science, WHO guidelines, and pediatric respiratory safety.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                isUser 
                  ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none' 
                  : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-tl-none space-y-2'
              }`}>
                {/* Content rendering */}
                <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                  {msg.content}
                </div>

                {/* Impact Highlight Pill */}
                {msg.impactHighlight && (
                  <div className="mt-3 p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                      <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
                      <span>{msg.impactHighlight.metric}: <strong>{msg.impactHighlight.value}</strong></span>
                    </div>
                    <span className="text-slate-400 text-[10px]">{msg.impactHighlight.meaning}</span>
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Suggested Follow-Ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(prompt)}
                          className="text-[11px] bg-slate-700/60 hover:bg-slate-700 text-teal-300 px-2.5 py-1 rounded-lg border border-slate-600/50 transition text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 ${isUser ? 'text-slate-800' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl rounded-tl-none text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>Reasoning across winter atmospheric inversion & pulmonary guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Prompt Pills */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 flex gap-1.5 overflow-x-auto no-scrollbar">
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[10px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-850 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about indoor hacks, low-emission routines, or child safety..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
