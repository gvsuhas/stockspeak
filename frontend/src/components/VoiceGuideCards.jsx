import React from 'react';
import { Volume2, Mic, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceGuideCards({ onSelectPrompt }) {
  const { t, activeLanguageObj } = useLanguage();

  const sampleGuides = [
    {
      title: "Stock IN (माक जोड़ें / ದಾಸ್ತಾನು ಸೇರಿಸಿ)",
      icon: <ArrowUpRight className="w-4 h-4 text-emerald-400" />,
      color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
      phrases: [
        "5 bag chawal aaya ₹1200 mein",
        "Added 10 kg sugar at 40 per kg",
        "15 packet milk receive hua"
      ]
    },
    {
      title: "Stock OUT (बिक्री घटाएं / ಬೆಲೆ ಸೇರಿಸಿ)",
      icon: <ArrowDownRight className="w-4 h-4 text-rose-400" />,
      color: "border-rose-500/30 bg-rose-500/5 text-rose-300",
      phrases: [
        "10 packet doodh gaya",
        "Sold 5 kg Wheat Flour",
        "3 cartons sunflower oil becha"
      ]
    },
    {
      title: "Stock Questions (सवाल पूछें / ಪ್ರಶ್ನೆ ಕೇಳಿ)",
      icon: <HelpCircle className="w-4 h-4 text-indigo-400" />,
      color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-300",
      phrases: [
        "Sugar kitna bacha hai?",
        "How much Rice is available?",
        "What items are running low?"
      ]
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl mb-6">
      
      <div className="flex items-center gap-2 mb-1">
        <Volume2 className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">{t('voiceGuideTitle')}</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {activeLanguageObj.native} Mode
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-4">{t('voiceGuideDesc')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sampleGuides.map((guide, idx) => (
          <div key={idx} className={`p-3.5 rounded-xl border ${guide.color}`}>
            <div className="flex items-center gap-2 font-bold text-xs mb-2">
              {guide.icon}
              <span>{guide.title}</span>
            </div>
            <div className="space-y-1.5">
              {guide.phrases.map((phrase, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => onSelectPrompt(phrase)}
                  className="w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/50 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                >
                  <span>🗣️ "{phrase}"</span>
                  <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Speak →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
