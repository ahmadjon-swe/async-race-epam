import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  create: { name: string; color: string };
  update: { name: string; color: string };
}

const initialState: FormState = {
  create: { name: '', color: '#000000' },
  update: { name: '', color: '#000000' },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCreateForm(state, action: PayloadAction<Partial<{ name: string; color: string }>>) {
      Object.assign(state.create, action.payload);
    },
    setUpdateForm(state, action: PayloadAction<Partial<{ name: string; color: string }>>) {
      Object.assign(state.update, action.payload);
    },
  },
});

export const { setCreateForm, setUpdateForm } = formSlice.actions;
export default formSlice.reducer;
