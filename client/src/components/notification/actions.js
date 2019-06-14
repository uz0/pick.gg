import { createAction } from 'redux-starter-kit';

const showNotification = createAction('showNotification');
const closeNotification = createAction('closeNotification');

export default {
  showNotification,
  closeNotification,
};
