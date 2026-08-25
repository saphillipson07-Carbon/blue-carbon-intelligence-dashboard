import { createContext, useContext, useEffect, useState } from 'react';
import { translate } from './i18n';

const AppCtx = createContext(null);

function initialLanguage() {
  try {
    return localStorage.getItem('bc_lang') || 'en';
  } catch {
    return 'en';
  }
}

export function AppProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [newsTab, setNewsTab] = useState('Latest News');
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem('bc_lang', language);
    } catch {
      // localStorage unavailable — language choice just won't persist
    }
  }, [language]);

  const t = (path, vars) => translate(language, path, vars);

  return (
    <AppCtx.Provider value={{ selectedCountry, setSelectedCountry, newsTab, setNewsTab, language, setLanguage, t }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  return useContext(AppCtx);
}
