import http from './http-service';
import BasicService from './basic-service';

export default class AdminService extends BasicService {
  syncDataWithEscore = async () => {
    const syncQuery = await http('/api/system/sync');
    const syncResult = await syncQuery.json();
    return syncResult;
  }

  createRealTournament = async tournamentData => {
    const tournamentQuery = await http('/api/admin/tournaments/real', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournament: tournamentData,
      }),
    });
    const tournament = await tournamentQuery.json();
    return tournament;
  }

  updateRealTournament = async (tournamentId, tournamentData) => {
    await http(`/api/admin/tournaments/real/${tournamentId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournament: tournamentData,
      }),
    });
  }

  deleteRealTournament = async tournamentId => {
    await http(`/api/admin/tournaments/real/${tournamentId}`, {
      method: 'DELETE',
    });
  }

  deleteFantasyTournament = async tournamentId => {
    await http(`/api/admin/tournaments/fantasy/${tournamentId}`, {
      method: 'DELETE',
    });
  }

  finalizeFantasyTournament = async tournamentId => {
    const finalizeQuery = await http(`/api/admin/tournaments/fantasy/${tournamentId}/finalize`);
    const finalizeResult = await finalizeQuery.json();
    return finalizeResult;
  }

  finalizeAllFantasyTournaments = async () => {
    const finalizeQuery = await http('/api/system/finalize');
    const finalizeResult = await finalizeQuery.json();
    return finalizeResult;
  }

  createMatch = async tournamentId => {
    const matchQuery = await http('/api/admin/matches', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentId,
      }),
    });
    const match = await matchQuery.json();
    return match;
  };

  deleteMatch = async matchId => {
    await http(`/api/admin/matches/${matchId}`, {
      method: 'DELETE',
    });
  }

  updateMatch = async ({ matchId, results, startDate, name, completed }) => {
    return this.request('PUT', `/api/admin/matches/${matchId}`, {
      name,
      startDate,
      completed,
      results,
    });
  }

  // UpdateMatch = async({ matchId, results, startDate, name, completed }) => {
  //   await http(`/api/admin/matches/${matchId}`, {
  //     method: 'PUT',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name,
  //       startDate,
  //       completed,
  //       results,
  //     }),
  //   });
  // }

  getMatchResult = async matchId => {
    const matchResultQuery = await http(`/api/admin/results/${matchId}`);
    const matchResult = await matchResultQuery.json();
    return matchResult;
  };

  addPlayerToRealTournament = async (tournamentId, player) => {
    const playersQuery = await http('/api/admin/tournaments/real/players', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentId,
        player,
      }),
    });
    const players = await playersQuery.json();
    return players;
  }

  removePlayerFromRealTournament = async (tournamentId, playerId) => {
    const playersQuery = await http('/api/admin/tournaments/real/players', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournamentId,
        playerId,
      }),
    });
    const players = await playersQuery.json();
    return players;
  }

  getRealTournaments = async () => {
    const tournamentsQuery = await http('/api/admin/tournaments/real');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getRealTournamentById = async tournamentId => {
    const tournamentQuery = await http(`/api/admin/tournaments/real/${tournamentId}`);
    const tournament = await tournamentQuery.json();
    return tournament;
  }

  getFantasyTournaments = async () => {
    const tournamentsQuery = await http('/api/admin/tournaments/fantasy');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getAllChampions = async () => {
    const championsQuery = await http('/api/admin/players');
    const champions = await championsQuery.json();
    return champions;
  }

  getAllUsers = async () => {
    const usersQuery = await http('/api/admin/users');
    const users = await usersQuery.json();
    return users;
  }

  getAllRules = async () => {
    const rulesQuery = await http('/api/admin/rules');
    const rules = await rulesQuery.json();
    return rules;
  }
}
