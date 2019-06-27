import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const initialState = {
  ids: [],
  list: {},
  isLoaded: false,
};

export default createReducer(initialState, {
  [actions.loadRewards]: (state, action) => {
    action.payload.forEach(reward => {
      state.ids.push(reward._id);
      state.list[reward._id] = reward;
    });

    state.isLoaded = true;
  },

  [actions.createReward]: (state, action) => {
    state.ids.push(action.payload._id);
    state.list[action.payload._id] = action.payload.reward;
  },

  [actions.updateReward]: (state, action) => {
    state.list[action.payload._id] = {
      ...state.list[action.payload._id],
      ...action.payload,
    };
  },

  [actions.deleteReward]: (state, action) => {
    state.ids = state.ids.filter(reward => reward !== action.payload);
    delete state.list[action.payload];
  },
});
