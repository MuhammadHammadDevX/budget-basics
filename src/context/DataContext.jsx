import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchAllContent } from '../services/dataService';

/**
 * Loads every JSON content file once when the app starts and shares it
 * with all pages. Pages read it with useData().
 */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });

  const load = useCallback(async () => {
    setState({ status: 'loading', data: null, error: '' });
    try {
      const data = await fetchAllContent();
      setState({ status: 'ready', data, error: '' });
    } catch (err) {
      setState({ status: 'error', data: null, error: err.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return <DataContext.Provider value={{ ...state, reload: load }}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
