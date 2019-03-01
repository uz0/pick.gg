import { notEqual } from "assert";

export default class MockService {

  // this is cyberspostsmen refs
  static getRandomTournamentChampions() {
    let players = [
      "5c76c480b9a6861dccea1cdf",
      "5c76c480b9a6861dccea1ce0",
      "5c76c480b9a6861dccea1ce1",
      "5c76c480b9a6861dccea1ce2",
      "5c76c480b9a6861dccea1ce3",
      "5c76c480b9a6861dccea1ce4",
      "5c76c480b9a6861dccea1ce5",
      "5c76c480b9a6861dccea1ce6",
      "5c76c480b9a6861dccea1ce7",
      "5c76c480b9a6861dccea1ce8",
      "5c76c480b9a6861dccea1ce9",
      "5c76c480b9a6861dccea1cea",
      "5c76c480b9a6861dccea1ceb",
      "5c76c480b9a6861dccea1cec",
      "5c76c480b9a6861dccea1ced",
      "5c76c480b9a6861dccea1cee",
      "5c76c480b9a6861dccea1cef",
      "5c76c480b9a6861dccea1cf0",
      "5c76c480b9a6861dccea1cf1",
      "5c76c480b9a6861dccea1cf2",
      "5c76c480b9a6861dccea1cf3"
    ]
    const shuffleFunc = (a,b) => Math.random() - 0.5;
    return players.sort(shuffleFunc).slice(0, 10);
  }

  static getRandomTournamentName(){
    let tournaments = [
      "StarLadder", "ESL ONE", "EsportsChampionship", "Intel Extreme Masters", "WESG",
      "FACEIT Major", "DreamHack", "ESL 2019", "EPICENTER", "ELEAGUE", "WCG",
      "Frankfurt Major", "Boston Major", "CSGO KOREA"
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