import type { Car, WinnerRow, WinnerSortField, SortOrder } from '../types';

export interface GarageState {
  cars: Car[];
  total: number;
  page: number;
  selectedId: number | null;
}

export interface WinnersState {
  items: WinnerRow[];
  total: number;
  page: number;
  sort: WinnerSortField;
  order: SortOrder;
}

export interface RaceState {
  isRacing: boolean;
  winner: { name: string; time: number } | null;
}

export interface FormState {
  create: { name: string; color: string };
  update: { name: string; color: string };
}

export interface AppState {
  view: 'garage' | 'winners';
  garage: GarageState;
  winners: WinnersState;
  race: RaceState;
  form: FormState;
}

export type AppAction =
  | { type: 'SET_VIEW'; payload: AppState['view'] }
  | { type: 'SET_GARAGE_DATA'; payload: { cars: Car[]; total: number } }
  | { type: 'SET_GARAGE_PAGE'; payload: number }
  | { type: 'SET_SELECTED_CAR'; payload: number | null }
  | { type: 'SET_WINNERS_DATA'; payload: { items: WinnerRow[]; total: number } }
  | { type: 'SET_WINNERS_PAGE'; payload: number }
  | { type: 'SET_WINNERS_SORT'; payload: { sort: WinnerSortField; order: SortOrder } }
  | { type: 'SET_RACE_STARTED' }
  | { type: 'SET_RACE_WINNER'; payload: { name: string; time: number } }
  | { type: 'RESET_RACE' }
  | { type: 'SET_CREATE_FORM'; payload: Partial<{ name: string; color: string }> }
  | { type: 'SET_UPDATE_FORM'; payload: Partial<{ name: string; color: string }> };
