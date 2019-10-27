import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const initialState = {
  ids: [],
  list: {},
  isLoaded: false,
};

export default createReducer(initialState, {
  [actions.loadUsers]: (state, action) => {
    state.ids = [];
    action.payload.forEach(user => {
      state.ids.push(user._id);
      state.list[user._id] = user;
    });
    state.isLoaded = true;
  },

  [actions.updateUser]: (state, action) => {
    state.list[action.payload._id] = {
      ...state.list[action.payload._id],
      ...action.payload,
    };
  },

  [actions.deleteUser]: (state, action) => {
    state.ids = state.ids.filter(user => user !== action.payload);
    delete state.list[action.payload];
  },
});
