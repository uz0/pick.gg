import http from './httpService';
import moment from 'moment';

export default class AdminService {

  getRealTournaments = async() => {
    const tournamentsQuery = await http('/api/admin/tournaments/real');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getFantasyTournaments = async() => {
    const tournamentsQuery = await http('/api/admin/tournaments/fantasy');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

  getAllChampions = async() => {
    const championsQuery = await http('/api/admin/players');
    const champions = await championsQuery.json();
    return champions;    
  }

  getAllUsers = async() => {
    const usersQuery = await http('/api/admin/users');
    const users = await usersQuery.json();
    return users;
  }

}
