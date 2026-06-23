import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RaceState {
  isRacing: boolean;
  winner: { name: string; time: number } | null;
}

const initialState: RaceState = {
  isRacing: false,
  winner: null,
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    startRace(state) {
      state.isRacing = true;
      state.winner = null;
    },
    setWinner(state, action: PayloadAction<{ name: string; time: number }>) {
      state.winner = action.payload;
    },
    resetRace(state) {
      state.isRacing = false;
      state.winner = null;
    },
  },
});

export const { startRace, setWinner, resetRace } = raceSlice.actions;
export default raceSlice.reducer;
