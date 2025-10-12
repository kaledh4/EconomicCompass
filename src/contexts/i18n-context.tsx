'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

type Translations = typeof en;
type I18nContextType = {
  t: (key: keyof Translations) => string;
};

const translations = { en, ar };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper function to access nested keys like "Nav.macro"
const getTranslation = (trans: Translations, key: string): string => {
  const keys = key.split('.');
  let result: any = trans;
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) return key; // Return key if not found
  }
  return result as string;
};


export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language } = useSettings();
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(translations[language]);

  useEffect(() => {
    setCurrentTranslations(translations[language]);
  }, [language]);

  const t = (key: keyof Translations | string) => {
    return getTranslation(currentTranslations, key);
  };

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
