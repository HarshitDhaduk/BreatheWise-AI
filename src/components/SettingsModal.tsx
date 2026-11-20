import React, { useState } from 'react';
import { X, Key, ExternalLink, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-title" className="text-base font-bold text-white">
                GenAI & API Configuration
              </h2>
              <p className="text-xs text-slate-400">Google Gemini API integration settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key (Optional)</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px]"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter a Google Gemini API key to query live `gemini-1.5-flash`. If left blank, BreatheWise automatically utilizes its high-fidelity local domain intelligence engine.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Zero-Telemetry & Privacy Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your API key and family vulnerability profiles are stored strictly inside your local browser storage (`localStorage`). They are never uploaded to any intermediary servers or logs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/20">
            <span className="font-bold text-teal-300 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Model Architecture
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Primary:</strong> Google Gemini 1.5 Flash (optimized for low-latency reasoning and grounded environmental prompts).<br />
              <strong>Secondary:</strong> Built-in Offline Respiratory & Atmospheric Smog Engine (guarantees 100% evaluation availability).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            Clear Stored Key
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-teal-500/20"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
