import express from "express";
import PlayerModel from "../models/player";

import TournamentModel from '../models/tournament';
import FantasyTournament from '../models/fantasy-tournament';
import MatchModel from '../models/match';
import MatchResultModel from '../models/match-result';

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

  router.get('/matches/:id', async (req, res) => {
    const matchId = req.params.id;
    const match = await MatchModel.findOne({ _id: matchId })
      .populate({
        path: 'results',
        populate: {
          path: 'playersResults.player',
          select: 'name'
        },
        populate: {
          path: 'playersResults.results.rule',
          select: 'name'  
        }
      })

    res.json({ match });
  });

  router.put('/matches/:id', async (req, res) => {
    const matchId = req.params.id;
    const { startDate, completed, name, results } = req.body;

    await MatchResultModel.findOneAndUpdate({ matchId }, { playersResults: results });
    const match = await MatchModel.findByIdAndUpdate(matchId, {
      name,
      startDate,
      completed,
    }, {
      new: true
    });

    io.emit('matchUpdated', { match });

    res.json({
      success: 'success',
      match
    });
  });

  router.post('/tournament', async (req, res) => {
    const { name, userId, entry, matches, thumbnail, playersIds, rulesValues } = req.body;

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
        startDate: new Date().toISOString(),
        syncAt: new Date().toISOString(),
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

      await MatchModel.update({ _id: matchId }, { resultsId: matchResultId });
      
      createdMatchesIds.push(matchId);
    }
    
    const tournament = await TournamentModel.create({
      name,
      date: new Date().toISOString(),
      champions_ids: playersIds,
      matches_ids: createdMatchesIds,
      syncType: 'manual',
      origin: 'manual',
    });

    const tournamentId = tournament._id;
    
    const fantasyTournamentRules = Object.entries(rulesValues).map(rule => ({
        rule: rule[0],
        score: rule[1]
      })
    );

    const fantasyTournament = await FantasyTournament.create({
      name,
      entry,
      thumbnail,
      tournament: tournamentId,
      rules: fantasyTournamentRules,
      creator: userId,
    });

    res.send({ fantasyTournament });
  });

  return router;
}

export default StreamerController;