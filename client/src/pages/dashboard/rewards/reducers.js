import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const initialState = {
  ids: [],
  list: [],
  isLoaded: false,
};

export default createReducer(initialState, {
  [actions.loadRewards]: (state, action) => {
    action.payload.forEach(reward => {
      state.ids.push(reward._id);
      state.list.push(reward);
    });

    state.isLoaded = true;
  },

  [actions.createReward]: (state, action) => {
    state.list.push(action.payload);
  },

  [actions.updateReward]: (state, action) => {
    state.list = state.list.map(reward => {
      if (reward._id === action.payload._id) {
        return {
          ...action.payload,
        };
      }

      return reward;
    });
  },

  [actions.deleteReward]: (state, action) => {
    state.list = state.list.filter(reward => reward._id !== action.payload);
  },
});
