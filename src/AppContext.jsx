import { createContext, useContext, useState } from 'react';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [newsTab, setNewsTab] = useState('Latest News');

  return (
    <AppCtx.Provider value={{ selectedCountry, setSelectedCountry, newsTab, setNewsTab }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  return useContext(AppCtx);
}
