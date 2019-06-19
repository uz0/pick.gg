import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const initialState = {
  ids: [],
  list: {},
  isLoaded: false,
};

export default createReducer(initialState, {
  [actions.loadTournaments]: (state, action) => {
    action.payload.forEach(tournament => {
      state.ids.push(tournament._id);
      state.list[tournament._id] = tournament;
    });

    state.isLoaded = true;
  },
});
