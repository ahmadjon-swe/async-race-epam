import { useContext } from 'react';
import { AppContext } from './app-context';
import type { AppContextValue } from './app-context';

export function useAppState(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}
