import http from './httpService';

export default class ChampionService {

  getAllChampions = async() => {
    let championsQuery = await http('/api/players');
    let champions = await championsQuery.json();
    return champions;
  }

}
