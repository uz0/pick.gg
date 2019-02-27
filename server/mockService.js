import { notEqual } from "assert";

export default class MockService {

  static getRandomTournamentChampions() {
    let players = [
      "s1mple", "Zeus", "electronic", "Edward", "flamie",
      "hitMouse", "seized", "f0rest", "Xyp9x", "flusha",
      "kioShiMa", "WorldEdit", "f0rest", "shox", "DavCost",
      "apEX", "neo", "n0thing", "deVVe", "dennis", "Snax"
    ]
    const shuffleFunc = (a,b) => Math.random() - 0.5;
    return players.sort(shuffleFunc).slice(0, 10);
  }

  static getRandomTournamentName(){
    let tournaments = [
      "StarLadder", "ESL ONE", "EsportsChampionship", "Intel Extreme Masters", "WESG",
      "FACEIT Major", "DreamHack", "ESL 2019", "EPICENTER", "ELEAGUE",
    ]
    const shuffleFunc = (a,b) => Math.random() - 0.5;
    return tournaments.sort(shuffleFunc)[0];
  }

  static generateRandomRuleValue() {
    const values = [1, 9, 8, 11, 12, 15, 7, 6, 3, 13];
    const random = () => Math.floor(Math.random() * 9) + 1;
    return values[random()];
  }

  static generatePlayerResult(name){
    return {
      name: name,
      kill: this.generateRandomRuleValue(),
      headshot: this.generateRandomRuleValue(),
      death: this.generateRandomRuleValue(),
      'plant bomb': this.generateRandomRuleValue()
    }
  }

}

let resultsRandomValues = [1, 9, 8, 11, 12, 15, 7, 6, 3, 4, 13];

