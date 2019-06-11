import { combineReducers } from 'redux';
import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const initialState = {};

const testReducer = createReducer(initialState, {
  [actions.types.test]: (state, action) => {
    state.test = action.payload;
  },
});

export default combineReducers({
  test: testReducer,
});
