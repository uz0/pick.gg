import http from './httpService';
import BasicService from './basicService';

export default class StreamerService extends BasicService {
  syncDataWithEscore = async() => {
    const syncQuery = await http(`/api/system/sync`);
    const syncResult = await syncQuery.json();
    return syncResult;
  }

  addPlayerToRealTournament = async(tournamentId, player) => {
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
}
