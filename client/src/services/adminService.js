import http from './httpService';
import moment from 'moment';

export default class AdminService {

  getRealTournaments = async() => {
    const tournamentsQuery = await http('/api/admin/tournaments/real');
    const tournaments = await tournamentsQuery.json();
    return tournaments;
  }

}
