import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car } from '../types';

interface GarageState {
  cars: Car[];
  total: number;
  page: number;
  selectedId: number | null;
}

const initialState: GarageState = {
  cars: [],
  total: 0,
  page: 1,
  selectedId: null,
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
  },
});

export const { setCars, setPage, setSelectedId } = garageSlice.actions;
export default garageSlice.reducer;
