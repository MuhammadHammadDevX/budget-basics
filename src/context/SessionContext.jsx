import React, { createContext, useContext, useReducer } from 'react';

/**
 * Temporary, in-memory demo data for the current visit only.
 * Nothing here is saved to the browser or sent anywhere: a page reload clears it.
 * Keeping it here (instead of inside each page) means entries survive moving
 * between pages during the same session.
 */
const SessionContext = createContext(null);

const initialState = {
  planner: {
    startingBalance: '500',
    entries: [
      { id: 'e1', date: '2026-09-01', category: 'Utilities', description: 'Hostel rent (sample)', amount: 200 },
      { id: 'e2', date: '2026-09-02', category: 'Transport', description: 'Monthly bus pass', amount: 40 },
      { id: 'e3', date: '2026-09-05', category: 'Food', description: 'Weekly groceries', amount: 25.5 },
    ],
  },
  chat: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'planner/setBalance':
      return { ...state, planner: { ...state.planner, startingBalance: action.value } };
    case 'planner/add':
      return { ...state, planner: { ...state.planner, entries: [...state.planner.entries, action.entry] } };
    case 'planner/update':
      return {
        ...state,
        planner: {
          ...state.planner,
          entries: state.planner.entries.map((e) => (e.id === action.entry.id ? action.entry : e)),
        },
      };
    case 'planner/remove':
      return {
        ...state,
        planner: { ...state.planner, entries: state.planner.entries.filter((e) => e.id !== action.id) },
      };
    case 'planner/clear':
      return { ...state, planner: { ...state.planner, entries: [] } };
    case 'chat/add':
      return { ...state, chat: [...state.chat, action.message] };
    case 'chat/clear':
      return { ...state, chat: [] };
    default:
      return state;
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
