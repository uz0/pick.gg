import { createAction } from 'redux-starter-kit';

const loadTournaments = createAction('loadTournaments');
const addTournament = createAction('addTournament');
const updateTournament = createAction('updateTournament');

export default {
  loadTournaments,
  addTournament,
  updateTournament,
};
