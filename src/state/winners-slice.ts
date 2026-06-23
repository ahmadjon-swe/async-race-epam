import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WinnerRow, WinnerSortField, SortOrder } from '../types';

interface WinnersState {
  items: WinnerRow[];
  total: number;
  page: number;
  sort: WinnerSortField;
  order: SortOrder;
}

const initialState: WinnersState = {
  items: [],
  total: 0,
  page: 1,
  sort: 'id',
  order: 'ASC',
};

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinners(state, action: PayloadAction<{ items: WinnerRow[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSort(state, action: PayloadAction<{ sort: WinnerSortField; order: SortOrder }>) {
      state.sort = action.payload.sort;
      state.order = action.payload.order;
    },
  },
});

export const { setWinners, setPage, setSort } = winnersSlice.actions;
export default winnersSlice.reducer;
