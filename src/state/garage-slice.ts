import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car } from '../types';

export type CarEngineStatus = 'idle' | 'driving' | 'broken';

interface GarageState {
  cars: Car[];
  total: number;
  page: number;
  selectedId: number | null;
  carStates: Record<number, CarEngineStatus>;
}

const initialState: GarageState = {
  cars: [],
  total: 0,
  page: 1,
  selectedId: null,
  carStates: {},
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<{ cars: Car[]; total: number }>) {
      state.cars = action.payload.cars;
      state.total = action.payload.total;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSelectedId(state, action: PayloadAction<number | null>) {
      state.selectedId = action.payload;
    },
    setCarStatus(state, action: PayloadAction<{ id: number; status: CarEngineStatus }>) {
      state.carStates[action.payload.id] = action.payload.status;
    },
    resetAllCarStates(state) {
      state.carStates = {};
    },
  },
});

export const { setCars, setPage, setSelectedId, setCarStatus, resetAllCarStates } =
  garageSlice.actions;
export default garageSlice.reducer;
