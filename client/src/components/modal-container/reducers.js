import actions from './actions';
import { createReducer } from 'redux-starter-kit';

const initialState = {
  ids: [],
  list: {},
};

export default createReducer(initialState, {
  [actions.toggleModal]: (state, action) => {
    const index = state.ids.indexOf(action.payload.id);

    if (index === -1) {
      state.ids.push(action.payload.id);

      if (action.payload.options) {
        state.list[action.payload.id] = action.payload.options;
      }
    } else {
      state.ids.splice(index, 1);

      if (state.list[action.payload.id]) {
        delete state.list[action.payload.id];
      }
    }
  },
});
