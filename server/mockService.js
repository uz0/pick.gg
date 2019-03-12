import moment from 'moment';
import find from 'lodash/find';

const players = [
  { id: 1, name: 'Zeus' },
  { id: 2, name: 'Edward' },
  { id: 3, name: 'seized' },
  { id: 4, name: 'GuardiaN' },
  { id: 5, name: 'flamie' },
  { id: 6, name: 'Snax' },
  { id: 7, name: 'Neo' },
  { id: 8, name: 'TaZ' },
  { id: 9, name: 'pashaBiceps' },
  { id: 10, name: 'byali' },
  { id: 11, name: 'Karrigan' },
  { id: 12, name: 'dev1ce' },
  { id: 13, name: 'dupreeh' },
  { id: 14, name: 'Xyp9x' },
  { id: 15, name: 'cajunb' },
  { id: 16, name: 'pronax' },
  { id: 17, name: 'flusha' },
  { id: 18, name: 'JW' },
  { id: 19, name: 'KRiMZ' },
  { id: 20, name: 'Olofmeister' },
];

const randomTournamentDate = () => {
  const dtMonthes = Math.floor(Math.random() * 3) + 1;
  const number = dtMonthes * (Math.round(Math.random()) * 2 - 1);
  return moment().add(number, 'months').add(number * -1, 'days').toISOString();
};

const tournaments = [
  { id: 1, name: 'StarLadder', date: randomTournamentDate() },
  { id: 2, name: 'ESL ONE', date: randomTournamentDate() },
  { id: 3, name: 'EsportsChampionship', date: randomTournamentDate() },
  { id: 4, name: 'Intel Extreme Masters', date: randomTournamentDate() },
  { id: 5, name: 'WESG', date: randomTournamentDate() },
  { id: 6, name: 'FACEIT Major', date: randomTournamentDate() },
  { id: 7, name: 'DreamHack', date: randomTournamentDate() },
  { id: 8, name: 'ESL 2019', date: randomTournamentDate() },
  { id: 9, name: 'EPICENTER', date: randomTournamentDate() },
  { id: 10, name: 'ELEAGUE', date: randomTournamentDate() },
  { id: 11, name: 'WCG', date: randomTournamentDate() },
  { id: 12, name: 'Frankfurt Major', date: randomTournamentDate() },
  { id: 13, name: 'Boston Major', date: randomTournamentDate() },
  { id: 14, name: 'CSGO KOREA', date: randomTournamentDate() },
];

export default class MockService {
  static getChampions() {
    return players;
  }

  static getTournaments() {
    return tournaments;
  };

  static generateTournamentMatches(tournament_id) {
    const to = Math.floor(Math.random() * 6) + 2;
    const tournament = find(tournaments, { id: tournament_id });
    let matches = [];

    for (let i = 1; i <= to; i++) {
      const date = moment(tournament.date).add(i, 'days');

      matches.push({
        tournament_id,
        startDate: date.toISOString(),
        results: null,
        completed: moment().isAfter(date),
      });
    }

    return matches;
  };

  static getRandomTournamentChampions() {
    const shuffleFunc = (a, b) => Math.random() - 0.5;
    return players.sort(shuffleFunc).slice(0, 10);
  };

  static generateRandomRuleValue() {
    const values = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    const random = () => Math.floor(Math.random() * values.length);
    return values[random()];
  }

  static generatePlayersResults(params) {
    const { match_id, tournament, rules } = params;
    let results = [];

    tournament.champions_ids.forEach(playerId => {
      let object = {
        playerId,
        results: [],
      };

      rules.forEach(rule => {
        object.results.push({
          rule: rule._id,
          score: this.generateRandomRuleValue(),
        });
      });

      results.push(object);
    });

    return results;
  };
}

let resultsRandomValues = [1, 9, 8, 11, 12, 15, 7, 6, 3, 4, 13];