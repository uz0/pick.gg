import http from './httpService';

export default class ChampionService {
  getAllChampions = async () => {
    const championsQuery = await http('/api/players');
    const champions = await championsQuery.json();
    return champions;
  }
}
