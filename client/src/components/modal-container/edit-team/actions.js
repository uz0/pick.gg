import findIndex from 'lodash/findIndex';
import { actions as tournamentsActions } from 'pages/tournaments';

const addTeamToTournament = ({ id, team }) => (dispatch, getState) => {
  const state = getState();
  const tournament = state.tournaments.list[id];

  if (!tournament) {
    return;
  }

  const teams = [...tournament.teams, team];

  dispatch(tournamentsActions.updateTournament({
    _id: id,
    teams,
  }));
};

const updateTournamentTeam = ({ id, team }) => (dispatch, getState) => {
  const state = getState();
  const tournament = state.tournaments.list[id];

  if (!tournament) {
    return;
  }

  const index = findIndex(tournament.teams, { _id: team._id });

  if (index !== -1) {
    tournament.teams[index] = team;
  }

  dispatch(tournamentsActions.updateTournament(tournament));
};

export default {
  addTeamToTournament,
  updateTournamentTeam,
};
