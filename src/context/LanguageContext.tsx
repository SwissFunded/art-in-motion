
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, SupportedLanguage } from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get preferred language from localStorage or browser settings, default to German
  const getBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'de' || browserLang === 'en' || browserLang === 'cs') {
      return browserLang as SupportedLanguage;
    }
    return 'de'; // Default to German
  };

  const storedLang = localStorage.getItem('preferredLanguage') as SupportedLanguage;
  const defaultLang = storedLang || getBrowserLanguage();
  
  const [language, setLanguageState] = useState<SupportedLanguage>(defaultLang);
  
  const setLanguage = (lang: SupportedLanguage) => {
    localStorage.setItem('preferredLanguage', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
