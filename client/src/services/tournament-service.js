import http from './httpService';
import moment from 'moment';
import BasicService from './basicService';

export default class TournamentService extends BasicService {
  participateInTournament = async (tournamentId, players) => {
    return this.request('POST', `/api/tournaments/${tournamentId}/setup`, players);
  }

  createNewTournament = payload => {
    return this.request('POST', '/api/tournaments', payload);
  }

  getRealTournaments = async () => {
    const tournamentsQuery = await http('/public/tournaments/real');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getFantasyTournaments = async () => {
    const tournamentsQuery = await http('/public/tournaments/fantasy');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getAllTournaments = async () => {
    const tournamentsQuery = await http('/public/tournaments');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getMyTournaments = async () => {
    const tournamentsQuery = await http('/api/tournaments/my');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getUserTournamentsById = async id => {
    const tournamentsQuery = await http(`/public/tournaments/user/${id}`);
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getTournamentById = async id => {
    const tournamentQuery = await http(`/public/tournaments/${id}`);
    const tournament = await tournamentQuery.json();
    return tournament;
  }

  filterTournamentsByEntry = async entryValue => {
    const tournamentsQuery = await http('/public/tournaments/fantasy');
    const tournaments = await tournamentsQuery.json();
    return tournaments.tournaments.filter(item => item.entry >= entryValue);
  }

  filterTournamentsByDate = async filterDate => {
    const tournaments = await this.getAllTournaments();
    return tournaments.tournaments.filter(item => moment(item.date).isAfter(filterDate));
  }

  filterTournamentsBySelect = async filterSelect => {
    const { tournaments } = await this.getFantasyTournaments();
    return tournaments.filter(item => item.tournament.name === filterSelect);
  }
}
