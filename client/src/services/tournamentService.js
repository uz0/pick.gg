import http from './httpService';
import moment from 'moment';

export default class TournamentService {

  constructor() {
    
  }

  participateInTournament = async(tournamentId, players) => {

    let participateQuery = await http(`/api/tournaments/${tournamentId}/setup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        players,
      }),
    })

    let participate = await participateQuery.json();
    return participate;

  }

  getAllTournaments = async() => {
    let tournamentsQuery = await http('/api/tournaments');
    let tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getTournamentById = async(id) => {
    let tournamentQuery = await http(`/api/tournaments/${id}`);
    let tournament = await tournamentQuery.json();
    return tournament;
  }

  filterTournamentsByEntry = async(entryValue) => {
    let tournaments = await this.getAllTournaments();
    return tournaments.tournaments.filter(item => item.entry >= entryValue);
  }

  filterTournamentsByDate = async(filterDate) => {
    let tournaments = await this.getAllTournaments();
    return tournaments.tournaments.filter(item => moment(item.date).isAfter(filterDate));
  }

}
