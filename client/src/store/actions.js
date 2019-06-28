import { createAction } from 'redux-starter-kit';

const setCurrentUser = createAction('setCurrentUser');
const setDevice = createAction('setDevice');

export default {
  setCurrentUser,
  setDevice,
};
