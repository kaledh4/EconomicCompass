'use client';

import React, { createContext, useState, useEffect, useMemo } from 'react';

type Language = 'en' | 'ar';
type Theme = 'dark' | 'light';

export type SettingsContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [language, setLanguageState] = useState<Language>('en');
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    const storedLanguage = (localStorage.getItem('language') as Language) || 'en';
    const storedAnimations = localStorage.getItem('animations') !== 'false';

    setThemeState(storedTheme);
    setLanguageState(storedLanguage);
    setAnimationsEnabledState(storedAnimations);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const root = window.document.documentElement;
      root.lang = language;
      root.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', language);
    }
  }, [language, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('animations', String(animationsEnabled));
    }
  }, [animationsEnabled, isMounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
      animationsEnabled,
      setAnimationsEnabled,
    }),
    [theme, language, animationsEnabled]
  );

  if (!isMounted) {
    // Prevent flash of unstyled content
    return null;
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
