import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournamentModel from "../models/fantasy-tournament";
import MatchModel from "../models/match";
import MatchResultModel from "../models/match-result";
import PlayerModel from "../models/player";
import RuleModel from "../models/rule";
import UserModel from "../models/user";

let router = express.Router();

const AdminController = () => {
  router.get('/tournaments/real', async (req, res) => {
    const tournaments = await TournamentModel.find()
      .populate('champions', '_id name')
      .populate('matches')
      .sort({ date: -1 })

    res.json({ tournaments });
  });

  router.put('/tournaments/real/:id', async (req, res) => {
    const tournamentId = req.params.id;
    let { tournament } = req.body;

    const rules = await RuleModel.find();
    const removedChampionsIds = tournament.removedChampionsIds;
    const addedChampionsIds = tournament.addedChampionsIds;

    const generatePlayerResults = (playerId) => {
      const results = rules.map(rule => ({
        rule: rule._id,
        score: 0
      }));

      return {
        playerId,
        results
      }
    };

    await TournamentModel.findByIdAndUpdate(tournamentId,
      {
        name: tournament.name,
        date: tournament.date,
        champions: tournament.champions,
      },
      {
        upsert: true
      },
    );

    const updatedTournamentMatches = await MatchModel
      .find({ id: { $in: tournament.matches_ids } })
      .populate('results')

    if(addedChampionsIds.length > 0 || removedChampionsIds.length > 0){
      for (let i = 0; i < updatedTournamentMatches.length; i++) {
        const resultsId = updatedTournamentMatches[i].results._id;
  
        if (removedChampionsIds.length > 0) {
          for (let j = 0; j < removedChampionsIds.length; j++) {
            await MatchResultModel.findOneAndUpdate({ _id: resultsId }, {
              $pull: { playersResults: { result: removedChampionsIds[j] } },
            });
          }
        }
  
        if (addedChampionsIds.length > 0) {
          const playersResults = addedChampionsIds.reduce((results, championId) => {
            results.push(generatePlayerResults(championId));
            return results;
          }, []);
  
          await MatchResultModel.findOneAndUpdate({ _id: resultsId }, {
            $push: { playersResults: { $each: playersResults } },
          });
        }
      }
    }

    res.json({
      updatedTournamentMatches
    });
  });

  router.post('/tournaments/real', async (req, res) => {
    const { tournament } = req.body;

    const newTournament = await TournamentModel.create(tournament);

    res.json({
      newTournament
    });
  });

  router.get('/tournaments/fantasy', async (req, res) => {
    const tournaments = await FantasyTournamentModel
      .find()
      .populate({
        path:'creator',
        select: 'username _id'
      })
      .populate({
        path:'rules.rule',
      });

    res.json({ tournaments });
  });

  router.put('/tournaments/fantasy/:id', async (req, res) => {
    const tournamentId = req.params.id;
    const { tournament } = req.body;

    const normalizedRules = tournament.rules.map(rule => ({
      rule: rule.rule._id,
      score: rule.score,
    }));

    await FantasyTournamentModel.findByIdAndUpdate(tournamentId,
      {
        name: tournament.name,
        entry: tournament.entry,
        rules: normalizedRules,
      },
      {
        upsert: true
      },
    );

    res.send({
      success: 'success',
    })
  });

  router.get('/rules', async (req, res) => {
    const rules = await RuleModel.find();
    res.json({ rules });
  });

  router.post('/rules', async (req, res) => {
    const ruleData = req.body.rule;
    const rule = await RuleModel.create(ruleData);
    
    res.json({ rule });
  });

  router.put('/rules/:id', async (req, res) => {
    const ruleId = req.params.id;
    const ruleData = req.body.rule;

    const rule = await RuleModel.findByIdAndUpdate(ruleId, ruleData);
    res.json({ rule });
  });

  router.delete('/rules/:id', async (req, res) => {
    const ruleId = req.params.id;
    const rule = await RuleModel.findByIdAndRemove(ruleId);

    res.json({ rule });
  });

  router.get('/matches', async (req, res) => {
    const matches = await MatchModel.find();
    res.json({ matches });
  });

  router.get('/matches/:id', async (req, res) => {
    const matchId = req.params.id;
    const match = await MatchModel.findOne({ _id: matchId }).populate('results');

    res.json({ match });
  });

  router.get('/results', async (req, res) => {
    const results = await MatchResultModel.find({ playersResults: { $gt: [] } });
    res.json({ results });
  });

  router.get('/results/:id', async (req, res) => {
    const resultId = req.params.id;
    const result = await MatchResultModel
      .findById(resultId)
      .populate('playersResults.results.rule')

    res.json({ result });
  });

  router.put('/results', async (req, res) => {
    const { results, matchId } = req.body;

    const matchResult = await MatchResultModel.findOneAndUpdate({ matchId }, { playersResults: results });

    res.json({ matchResult });
  });


  router.get('/players', async (req, res) => {
    const players = await PlayerModel.find();
    res.json({ players });
  });

  router.post('/players', async (req, res) => {
    const playerData = req.body.player;

    const player = await PlayerModel.create(playerData);
    res.json({ player });
  });

  router.get('/players/:id', async (req, res) => {
    const playerId = req.params.id;
    const player = await PlayerModel.findById(playerId);
    res.json({ player });
  });

  router.put('/players/:id', async (req, res) => {
    const playerId = req.params.id;
    const playerData = req.body.player;
    
    const player = await PlayerModel.findByIdAndUpdate(playerId, playerData);
    
    res.json({ player });
  });
  
  router.delete('/players/:id', async (req, res) => {
    const playerId = req.params.id;
    const player = await PlayerModel.findByIdAndRemove(playerId);
    res.json({ player });
  });

  router.get('/users', async (req, res) => {
    const users = await UserModel.find();
    res.json({ users });
  });

  router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    res.json({ user });
  });

  router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
    res.json({ user });
  });

  router.delete('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndDelete(userId);
    res.json({ user });
  });

  return router;
}

export default AdminController;