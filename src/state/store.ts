import { configureStore } from '@reduxjs/toolkit';
import garageReducer from './garage-slice';
import winnersReducer from './winners-slice';
import raceReducer from './race-slice';
import formReducer from './form-slice';
import viewReducer from './view-slice';

export const store = configureStore({
  reducer: {
    view: viewReducer,
    garage: garageReducer,
    winners: winnersReducer,
    race: raceReducer,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
