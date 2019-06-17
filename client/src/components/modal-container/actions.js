import { createAction } from 'redux-starter-kit';

const toggleModal = createAction('toggleModal');
const closeModal = createAction('closeModal');

export default {
  toggleModal,
  closeModal,
};
