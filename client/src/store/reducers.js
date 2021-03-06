import { combineReducers } from 'redux';
import { createReducer } from 'redux-starter-kit';
import { reducers as tournamentsReducers } from 'pages/tournaments';
import { reducers as userTournamentsReducers } from 'pages/mytournaments';
import { reducers as rewardsReducers } from 'pages/dashboard/rewards';
import { reducers as usersReducers } from 'pages/dashboard/users';

import { reducers as modalReducers } from 'components/modal-container';
import { reducers as notificationReducers } from 'components/notification';

import actions from './actions';

const currentUserReducer = createReducer(null, {
  [actions.setCurrentUser]: (state, action) => action.payload,
});

const deviceReducer = createReducer(null, {
  [actions.setDevice]: (state, action) => action.payload,
});

export default combineReducers({
  currentUser: currentUserReducer,
  device: deviceReducer,
  notification: notificationReducers,
  modal: modalReducers,
  tournaments: tournamentsReducers,
  userTournaments: userTournamentsReducers,
  rewards: rewardsReducers,
  users: usersReducers,
});
