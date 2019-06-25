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
});
