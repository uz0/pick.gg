import http from './httpService';
import BasicService from './basicService';

export default class StreamerService extends BasicService {
  createPlayer = async({ name, photo, position }) => {
    const request = await http(`/api/streamer/players`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        photo,
        position
      }),
    });
    const requestResult = await request.json();
    return requestResult;
  }

  async createTournament({ name, entry, playersIds, matches, thumbnail, rulesValues, userId }) {
    const request = await http(`/api/streamer/tournament`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        name,
        entry,
        matches,
        thumbnail,
        playersIds,
        rulesValues,
      }),
    });
    const requestResult = await request.json();
    return requestResult;
  }

  async getAllChampions() {
    const championsQuery = await http('/api/streamer/players');
    const champions = await championsQuery.json();
    return champions;
  }

  async getMatchInfo(matchId) {
    const matchQuery = await http(`/api/streamer/matches/${matchId}`);
    const match = await matchQuery.json();
    return match;
  }

  async updateMatch({ matchId, results, startDate, name, completed }) {
    await http(`/api/streamer/matches/${matchId}/result`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        startDate,
        completed,
        results,
      }),
    });
  }

  async getLastMatches(accountId) {
    const matchesQuery = await http(`/api/streamer/matches/last/${accountId}`);
    const matches = await matchesQuery.json();
    return matches;
  }
}
