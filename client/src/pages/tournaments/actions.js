import { createAction } from 'redux-starter-kit';

const loadTournaments = createAction('loadTournaments');
const addTournament = createAction('addTournament');

export default {
  loadTournaments,
  addTournament,
};
