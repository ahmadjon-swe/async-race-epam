import type { AppState } from './types';

export const initialState: AppState = {
  view: 'garage',
  garage: {
    cars: [],
    total: 0,
    page: 1,
    selectedId: null,
  },
  winners: {
    items: [],
    total: 0,
    page: 1,
    sort: 'id',
    order: 'ASC',
  },
  race: {
    isRacing: false,
    winner: null,
  },
  form: {
    create: { name: '', color: '#000000' },
    update: { name: '', color: '#000000' },
  },
};
