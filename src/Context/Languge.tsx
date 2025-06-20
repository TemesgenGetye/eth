import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import translations from '../../translations.json';
import LanguageDetector from 'i18next-browser-languagedetector';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      return storedLang;
    }
    const detector = new LanguageDetector();
    let detectedLang = detector.detect();
    if (Array.isArray(detectedLang)) {
      detectedLang = detectedLang[0];
    }
    // Ensure detected language is supported, otherwise fallback to 'en'
    if (
      detectedLang &&
      Object.prototype.hasOwnProperty.call(translations, detectedLang)
    ) {
      return detectedLang;
    }
    return 'en';
  });

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language as keyof typeof translations];

    for (const k of keys) {
      if (
        value &&
        typeof value === 'object' &&
        k in (value as Record<string, unknown>)
      ) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  // Update document direction and localStorage when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);

    // Add Arabic font class for Arabic language
    if (language === 'ar') {
      document.body.classList.add('arabic-font');
    } else {
      document.body.classList.remove('arabic-font');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
