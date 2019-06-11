import { combineReducers } from 'redux';
import { createReducer } from 'redux-starter-kit';
import actions from './actions';

const currentUserReducer = createReducer(null, {
  [actions.setCurrentUser]: (state, action) => action.payload,
});

export default combineReducers({
  currentUser: currentUserReducer,
});
