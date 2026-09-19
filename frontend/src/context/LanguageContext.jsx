import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('stockspeak_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('stockspeak_lang', currentLang);
  }, [currentLang]);

  const activeLanguageObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
  const t = (key) => {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, activeLanguageObj, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
