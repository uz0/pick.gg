import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const initialState = {
  ids: [],
  list: {},
  isLoaded: false,
};

export default createReducer(initialState, {
  [actions.loadRewards]: (state, action) => {
    const ids = [];
    const list = {};

    action.payload.forEach(reward => {
      ids.push(reward._id);
      list[reward._id] = reward;
    });

    return {
      ids,
      list,
      isLoaded: true,
    };
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

  [actions.filterRewardsByClaim]: (state, action) => {
    const rewards = Object.values(state.list).filter(reward => reward.isClaimed === action.payload);
    const filteredRewardsIds = rewards.map(item => item._id);
    const list = {};

    rewards.forEach(reward => {
      list[reward._id] = reward;
    });

    return {
      ids: filteredRewardsIds,
      list,
      isLoaded: true,
    };
  },

  [actions.filterRewardsByUser]: (state, action) => {
    const rewards = Object.values(state.list).filter(reward => reward.userId === action.payload);
    const filteredRewardsIds = rewards.map(item => item._id);
    const list = {};

    rewards.forEach(reward => {
      list[reward._id] = reward;
    });

    return {
      ids: filteredRewardsIds,
      list,
      isLoaded: true,
    };
  },
});
