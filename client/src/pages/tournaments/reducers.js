import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const initialState = {
  ids: [],
  list: {},
  isLoaded: false,
};

export default createReducer(initialState, {
  [actions.loadTournaments]: (state, action) => {
    state.isLoaded = true;

    const res = action.payload.reduce((acc, tournament) => ({
      ids: [...acc.ids, tournament._id],
      list: { ...acc.list, [tournament._id]: tournament },
    }), initialState);

    return Object.assign(state, res);
  },

  [actions.addTournament]: (state, action) => {
    if (!state.ids.includes(action.payload._id)) {
      state.ids.push(action.payload._id);
      state.list[action.payload._id] = action.payload;
    }
  },

  [actions.updateTournament]: (state, action) => {
    state.list[action.payload._id] = {
      ...state.list[action.payload._id],
      ...action.payload,
    };
  },
});
