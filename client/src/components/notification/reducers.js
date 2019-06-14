import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const initialState = {
  isShown: false,
  type: '',
  message: '',
};

export default createReducer(initialState, {
  [actions.showNotification]: (state, action) => {
    state.isShown = true;
    state.type = action.payload.type;
    state.message = action.payload.message;
  },

  [actions.closeNotification]: (state, action) => {
    state.isShown = false;
    state.type = '';
    state.message = '';
  },
});
