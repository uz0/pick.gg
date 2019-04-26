import express from "express";
import PlayerModel from "../models/player";

import TournamentModel from '../models/tournament';
import FantasyTournament from '../models/fantasy-tournament';
import MatchModel from '../models/tournament';

let router = express.Router();

const StreamerController = () => {
  router.get('/', async (req, res) => {
    let players = await PlayerModel.find();
    res.json({ players });
  });

  router.post('/players', async (req, res) => {
    const { name, photo, position } = req.body;

    if(name.length > 20){
      res.status(400).send({
        error: 'Name can not contain more than 20 characters',
      })
    }

    if(!position){
      res.status(400).send({
        error: 'Position field is required',
      })
    }

    const player = await PlayerModel.create({
      name,
      photo,
      position
    });

    res.send({ player });
  });

  router.get('/players', async (req, res) => {
    const players = await PlayerModel.find();
    res.json({ players });
  });

  router.post('/tournament', async (req, res) => {
    const { name, photo, position } = req.body;

    let createdMatchesIds = [];

    const generatePlayersResults = (players) => {
      let results = [];
      const rulesIds = Object.keys(rulesValues);
      let rulesMock = rulesIds.map(item => ({ rule: item, score: 0 }));

      for(let i = 0; i < players.length; i++){
        const playerResult = {
          playerId: players[i],
          results: rulesMock,
        }

        results.push(playerResult);
      }

      return results;
    }
    
    for(let i = 0; i < matches.length; i++){
      const matchMock = {
        tournament_id: '',
        resultsId: '',
        name: matches[i].name,
        completed: false,
        startDate: new Date(),
        syncAt: new Date(),
        syncType: 'manual',
        origin: 'manual',
      };

      const match = await MatchModel.create(matchMock);
      const matchId = match._id;
      
      const matchResultMock = {
        matchId,
        playersResults: generatePlayersResults(playersIds),
      };
      
      const matchResult = await MatchResultModel.create(matchResultMock);
      const matchResultId = matchResult._id;

      await MatchModel.update({ _id: matchId }, { resultId: matchResultId });

      createdMatchesIds.push(matchId);
    }

    const tournament = await TournamentModel.create({
      name,
      date: new Date(),
      champions_ids: playersIds,
      matches_ids: createdMatchesIds,
      syncType: 'manual',
      origin: 'manual',
    });

    const tournamentId = tournament._id;
    
    const fantasyTournamentRules = Object.values(rulesValues).map(rules => ({
      rules: rules[0],
      score: rules[1]
    }));

    const fantasyTournament = await FantasyTournament.create({
      name,
      entry,
      thumbnail,
      tournament: tournamentId,
      rules: fantasyTournamentRules,
    });

    res.send({ fantasyTournament });
  });

  return router;
}

export default StreamerController;