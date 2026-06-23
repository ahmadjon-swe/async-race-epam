import type { AppState, AppAction } from './types';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW': {
      return { ...state, view: action.payload };
    }
    case 'SET_GARAGE_DATA': {
      return { ...state, garage: { ...state.garage, ...action.payload } };
    }
    case 'SET_GARAGE_PAGE': {
      return { ...state, garage: { ...state.garage, page: action.payload } };
    }
    case 'SET_SELECTED_CAR': {
      return { ...state, garage: { ...state.garage, selectedId: action.payload } };
    }
    case 'SET_WINNERS_DATA': {
      return { ...state, winners: { ...state.winners, ...action.payload } };
    }
    case 'SET_WINNERS_PAGE': {
      return { ...state, winners: { ...state.winners, page: action.payload } };
    }
    case 'SET_WINNERS_SORT': {
      return { ...state, winners: { ...state.winners, ...action.payload } };
    }
    case 'SET_RACE_STARTED': {
      return { ...state, race: { isRacing: true, winner: null } };
    }
    case 'SET_RACE_WINNER': {
      return { ...state, race: { ...state.race, winner: action.payload } };
    }
    case 'RESET_RACE': {
      return { ...state, race: { isRacing: false, winner: null } };
    }
    case 'SET_CREATE_FORM': {
      return {
        ...state,
        form: { ...state.form, create: { ...state.form.create, ...action.payload } },
      };
    }
    case 'SET_UPDATE_FORM': {
      return {
        ...state,
        form: { ...state.form, update: { ...state.form.update, ...action.payload } },
      };
    }
    default: {
      return state;
    }
  }
}
