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
      if (state.ids.indexOf(tournament._id) === -1) {
        state.ids.push(tournament._id);
        state.list[tournament._id] = tournament;
      }
    });

    state.isLoaded = true;
  },

  [actions.addTournament]: (state, action) => {
    if (state.ids.indexOf(action.payload._id) === -1) {
      state.ids.push(action.payload._id);
      state.list[action.payload._id] = action.payload;
    }
  },
});
