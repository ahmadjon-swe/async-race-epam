import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type View = 'garage' | 'winners';

const viewSlice = createSlice({
  name: 'view',
  initialState: 'garage' as View,
  reducers: {
    setView(_state, action: PayloadAction<View>) {
      return action.payload;
    },
  },
});

export const { setView } = viewSlice.actions;
export default viewSlice.reducer;
