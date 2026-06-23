import { useReducer } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './app-context';
import { appReducer } from './reducer';
import { initialState } from './initial-state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
