export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export type WinnerSortField = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface WinnerRow extends Winner {
  name: string;
  color: string;
}
