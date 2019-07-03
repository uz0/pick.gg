import { createAction } from 'redux-starter-kit';

const loadUsers = createAction('loadUsers');
const updateUser = createAction('editUser');
const deleteUser = createAction('deleteUser');

export default {
  loadUsers,
  updateUser,
  deleteUser,
};
