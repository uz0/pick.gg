import http from './http-service';

export default class ChampionService {
  getAllChampions = async () => {
    const championsQuery = await http('/api/players');
    const champions = await championsQuery.json();
    return champions;
  }
}
