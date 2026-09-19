import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2, Sparkles, Send, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';
import { createSpeechRecognizer, speakText } from '../utils/speech';

export default function VoiceMicModal({ isOpen, onClose }) {
  const { activeLanguageObj, t } = useLanguage();
  const { processVoiceCommand } = useInventory();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedCommand, setTypedCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [recognizer, setRecognizer] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
      setTranscript('');
      setLastResponse(null);
    }
  }, [isOpen]);

  const startListening = () => {
    setTranscript('');
    setLastResponse(null);
    const rec = createSpeechRecognizer(
      activeLanguageObj.speechLang,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 2) {
          handleExecuteVoice(text);
        }
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      try {
        rec.start();
        setRecognizer(rec);
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognizer) {
      try { recognizer.stop(); } catch (e) {}
    }
    setIsListening(false);
  };

  const handleExecuteVoice = async (textToProcess) => {
    const query = textToProcess || transcript || typedCommand;
    if (!query.trim()) return;

    stopListening();
    setIsProcessing(true);

    const res = await processVoiceCommand(query);
    setLastResponse(res);
    setIsProcessing(false);
    setTypedCommand('');
  };

  const handleReplayVoice = () => {
    if (lastResponse?.audioText) {
      speakText(lastResponse.audioText, activeLanguageObj.speechLang);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card border border-indigo-500/30 rounded-3xl p-6 shadow-2xl shadow-indigo-500/20 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">StockSpeak Assistant</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {activeLanguageObj.native}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Pulsating Mic Button & Waveform Animation */}
        <div className="flex flex-col items-center justify-center my-6 text-center">
          <div className="relative mb-4">
            {/* Pulsating ring when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping"></div>
                <div className="absolute -inset-4 rounded-full bg-indigo-500/20 animate-pulse"></div>
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 to-rose-500 glow-mic-listening text-white'
                  : 'bg-gradient-to-tr from-indigo-600 to-emerald-500 glow-mic-btn text-white'
              }`}
            >
              <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          <p className="text-sm font-semibold text-slate-300">
            {isListening ? t('micListening') : isProcessing ? t('micProcessing') : t('micBtnText')}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Speak natural stock updates like <span className="text-indigo-300 font-medium">"5 bag chawal aaya"</span> or ask <span className="text-emerald-300 font-medium">"Rice kitna hai?"</span>
          </p>
        </div>

        {/* Live Transcript / Processing View */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 min-h-[90px] flex flex-col justify-between mb-4">
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>TRANSCRIPT / INPUT:</span>
            {isListening && <span className="text-rose-400 animate-pulse">🔴 Live Speech</span>}
          </div>
          <p className="text-slate-100 font-medium text-sm italic">
            {transcript || typedCommand || "Say something or click a quick sample prompt below..."}
          </p>
        </div>

        {/* Action Intent Result Card */}
        {lastResponse && (
          <div className={`p-4 rounded-2xl border mb-4 text-xs animate-fadeIn ${
            lastResponse.parsed?.intent === 'STOCK_IN'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : lastResponse.parsed?.intent === 'STOCK_OUT'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-sm mb-1">
              <span className="flex items-center gap-1.5">
                {lastResponse.parsed?.intent === 'STOCK_IN' && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
                {lastResponse.parsed?.intent === 'STOCK_OUT' && <ArrowDownRight className="w-4 h-4 text-rose-400" />}
                {lastResponse.parsed?.intent?.startsWith('QUERY') && <HelpCircle className="w-4 h-4 text-indigo-400" />}
                Intent: {lastResponse.parsed?.intent}
              </span>
              <button
                onClick={handleReplayVoice}
                className="flex items-center gap-1 text-[11px] bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Replay Voice
              </button>
            </div>
            <p className="font-semibold text-white mt-1 text-xs sm:text-sm">
              📢 {lastResponse.message}
            </p>
          </div>
        )}

        {/* Quick Sample Voice Command Prompt Chips */}
        <div className="mb-4">
          <p className="text-[11px] text-slate-400 font-semibold mb-2">TRY SAMPLE PROMPTS:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "5 bag chawal aaya ₹1200 mein",
              "10 packet doodh gaya",
              "Sugar kitna bacha hai?",
              "What items are running low?"
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTypedCommand(prompt);
                  handleExecuteVoice(prompt);
                }}
                className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-left"
              >
                🗣️ "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Manual Input Fallback */}
        <form onSubmit={(e) => { e.preventDefault(); handleExecuteVoice(); }} className="flex gap-2">
          <input
            type="text"
            placeholder="Or type voice text manually..."
            value={typedCommand}
            onChange={(e) => setTypedCommand(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
