import { combineReducers } from 'redux';
import { createReducer } from 'redux-starter-kit';
import { reducers as notificationReducers } from 'components/notification';
import { reducers as modalReducers } from 'components/modal-container';
import { reducers as tournamentsReducers } from 'pages/tournaments';
import { reducers as rewardsReducers } from 'pages/dashboard/rewards';

import actions from './actions';

const currentUserReducer = createReducer(null, {
  [actions.setCurrentUser]: (state, action) => action.payload,
});

export default combineReducers({
  currentUser: currentUserReducer,
  notification: notificationReducers,
  modal: modalReducers,
  tournaments: tournamentsReducers,
  rewards: rewardsReducers,
});
