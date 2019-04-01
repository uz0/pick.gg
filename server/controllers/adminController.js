import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournamentModel from "../models/fantasy-tournament";
import MatchModel from "../models/match";
import TransactionModel from "../models/transaction";
import MatchResultModel from "../models/match-result";
import PlayerModel from "../models/player";
import RuleModel from "../models/rule";
import UserModel from "../models/user";

import find from 'lodash/find';

let router = express.Router();

const AdminController = () => {
  router.put('/tournaments/real/players', async (req, res) => {
    const { tournamentId, player } = req.body;

    const rules = await RuleModel.find();
    const tournament = await TournamentModel.findByIdAndUpdate(tournamentId, {
      $push: {
        champions_ids: player
      }
    });

    const tournamentMatches = await MatchModel.find({ tournament_id: tournamentId }, '_id');
    const tournamentMatchesIds = tournamentMatches.map(match => match._id);

    const results = rules.map(rule => ({
      rule: rule._id,
      score: 0
    }));

    const playerResult = {
      playerId: player._id,
      results,
    }

    await MatchResultModel.updateMany({ matchId: { $in: tournamentMatchesIds } }, {
      $push: { playersResults: playerResult }
    })

    res.json({
      tournament
    });
  });

  router.delete('/tournaments/real/players', async (req, res) => {
    const { tournamentId, playerId } = req.body;

    const tournament = await TournamentModel.update({ _id: tournamentId }, {
      $pull: {
        champions_ids: playerId
      }
    });

    const tournamentMatches = await MatchModel.find({ tournament_id: tournamentId }, '_id');
    const tournamentMatchesIds = tournamentMatches.map(match => match._id);

    await MatchResultModel.updateMany({ matchId: { $in: tournamentMatchesIds } }, {
      $pull: { playersResults: { playerId: playerId } }
    });

    res.json({
      tournament
    });
  });

  router.get('/user/:id/admin', async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate({ _id: userId }, { isAdmin: true });

    res.json({ user });
  });

  router.get('/tournaments/real', async (req, res) => {
    const tournaments = await TournamentModel.find()
      .populate('champions', 'id name')
      // .populate('matches')
      .populate({
        path: 'matches',
        populate: {
          path: 'results'
        }
      })
      .sort({ date: -1 })

    res.json({ tournaments });
  });

  router.post('/tournaments/real', async (req, res) => {
    const { tournament } = req.body;

    const newTournament = await TournamentModel.create(tournament);

    res.json({
      newTournament
    });
  });

  router.get('/tournaments/real/:id', async (req, res) => {
    const tournamentId = req.params.id;
    const tournament = await TournamentModel.findById(tournamentId)
      .populate('champions', '_id name')
      .populate('matches')
      .populate({
        path: 'matches',
        populate: {
          path: 'results'
        }
      })

    res.json({ tournament });
  });

  router.put('/tournaments/real/:id', async (req, res) => {
    const tournamentId = req.params.id;
    let { tournament } = req.body;

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

    res.json({
      tournament
    });
  });

  router.delete('/tournaments/real/:id', async (req, res) => {
    const tournamentId = req.params.id;

    const tournament = await TournamentModel.findById(tournamentId).populate('matches');
    const tournamentMatchesIds = tournament.matches.map(match => match._id);
    const tournamentMatchesResultsIds = tournament.matches.map(match => match.results);

    await MatchResultModel.deleteMany({ _id: { $in: tournamentMatchesResultsIds } });
    await MatchModel.deleteMany({ _id: { $in: tournamentMatchesIds } });
    await TournamentModel.deleteOne({ _id: tournamentId });

    res.json({
      tournament
    });
  });

  router.get('/tournaments/fantasy', async (req, res) => {
    const tournaments = await FantasyTournamentModel
      .find()
      .populate({
        path: 'creator',
        select: 'username _id'
      })
      .populate({
        path: 'winner',
      })
      .populate({
        path: 'rules.rule',
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

  router.delete('/tournaments/fantasy/:id', async (req, res) => {
    const tournamentId = req.params.id;

    await FantasyTournamentModel.deleteOne({ _id: tournamentId });

    res.json({
      success: "success"
    });
  });

  router.get('/tournaments/fantasy/:id/finalize', async (req, res) => {
    const tournamentId = req.params.id;

    const fantasyTournament = await FantasyTournamentModel
      .findById(tournamentId)
      .populate({ path: 'users.players', select: '_id id name photo' })
      .populate({ path: 'users.user', select: '_id username' })
      .populate({ path: 'rules.rule' })
      .populate({ path: 'winner', select: 'id username' })
      .populate({ path: 'creator', select: 'id username' })
      .populate('tournament')
      .populate({
        path: 'tournament',
        populate: {
          path: 'champions',
        }
      })
      .populate({
        path: 'tournament',
        populate: {
          path: 'matches',
          populate: {
            path: 'results'
          }
        }
      });

    if (fantasyTournament.winner) {
      res.json({
        success: "false",
        message: "Tournament is already finalized"
      });

      return;
    }

    const realTournament = fantasyTournament.tournament;

    const matches = realTournament.matches;
    const areMatchesCompleted = matches.every(match => match.completed === true);

    const rulesSet = fantasyTournament.rules.reduce((set, item) => {
      set[item.rule.name] = item.score;
      return set;
    }, {});

    let playersCountedResults = [];

    const getUserPlayers = (userId) => {
      const user = find(fantasyTournament.users, (item) => item.user._id === userId);
      return user.players;
    };

    const getCountMatchPoints = (matchId, userId) => {
      const userPlayers = getUserPlayers(userId);
      const userPlayersIds = userPlayers.map(player => player.id);

      const match = find(matches, { _id: matchId });
      const results = match.results.playersResults;

      let userPlayersWithResults = [];

      for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < userPlayersIds.length; j++) {
          if (`${results[i].playerId}` === `${userPlayersIds[j]}`) {
            userPlayersWithResults.push(results[i]);
          }
        }
      }

      const userPlayersResults = userPlayersWithResults.reduce((arr, item) => {
        arr.push(...item.results);
        return arr;
      }, []);

      const userPlayersResultsSum = userPlayersResults.reduce((sum, item) => {
        if (rulesSet[item.rule]) {
          sum += item.score * rulesSet[item.rule];
        }
        return sum;
      }, 0);

      return userPlayersResultsSum;
    };

    const getTotalUserScore = (userId) => {
      const userMatchResults = fantasyTournament.tournament.matches.map(match => getCountMatchPoints(match._id, userId));
      const totalUserScore = userMatchResults.reduce((sum, score) => sum += score);

      return totalUserScore;
    };

    if (!areMatchesCompleted) {
      res.json({
        success: "false",
        message: "Not all matches of the tournament are completed"
      });

      return;
    }

    fantasyTournament.users.forEach(item => {
      playersCountedResults.push({
        user: item.user,
        score: getTotalUserScore(item.user._id)
      })
    });

    const tournamentWinner = playersCountedResults.sort((next, prev) => prev.score - next.score)[0];
    const tournamentPrize = fantasyTournament.entry * fantasyTournament.users.length;

    await FantasyTournamentModel.updateOne({ _id: tournamentId }, {
      winner: tournamentWinner.user._id,
    });

    await UserModel.findByIdAndUpdate({ _id: tournamentWinner.user._id }, { new: true, $inc: { balance: tournamentPrize } });
    await TransactionModel.create({
      userId: tournamentWinner.user._id,
      tournamentId,
      amount: tournamentPrize,
      origin: 'tournament winning',
      date: Date.now(),
    });

    res.json({
      message: "Finalization completed",
      success: "success",
    });
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

  router.post('/matches', async (req, res) => {
    const { tournamentId } = req.body;

    const rules = await RuleModel.find();

    const tournament = await TournamentModel
      .findById(tournamentId)
      .populate('champions');

    const tournamentChampions = tournament.champions;

    const match = await MatchModel.create({
      tournament_id: tournament._id,
      startDate: tournament.date,
      completed: false
    });
    const matchId = match._id;

    const generateChampionResults = rules.map(rule => ({
      rule: rule._id,
      score: 0
    }));

    let playersResults = [];

    for (let i = 0; i < tournamentChampions.length; i++) {
      const result = {
        playerId: tournamentChampions[i]._id,
        results: generateChampionResults,
      };

      playersResults.push(result);
    }

    console.log(playersResults);

    const matchResult = await MatchResultModel.create({
      matchId,
      playersResults,
      syncType: 'manual',
    });

    await MatchModel.update({ _id: matchId }, { resultsId: matchResult._id });
    await TournamentModel.update({ _id: tournamentId }, { $push: { matches_ids: matchId } });

    res.json({ match });
  });

  router.get('/matches', async (req, res) => {
    const matches = await MatchModel.find();
    console.log(matches);
    res.json({ matches });
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
    const { startDate, completed, results } = req.body;

    await MatchResultModel.findOneAndUpdate({ matchId }, { playersResults: results });
    await MatchModel.update({ _id: matchId }, {
      startDate,
      completed,
    });

    res.json({ success: 'success' });
  });

  router.delete('/matches/:id', async (req, res) => {
    const matchId = req.params.id;

    await TournamentModel.updateMany({
      $pull: {
        matches_ids: matchId,
      }
    });

    await MatchModel.deleteOne({ _id: matchId });

    res.send({
      success: 'success',
    });
  });

  router.get('/results', async (req, res) => {
    const results = await MatchResultModel.find();
    res.json({ results });
  });

  router.get('/results/:id', async (req, res) => {
    const resultId = req.params.id;
    const result = await MatchResultModel
      .find({ match_id: resultId })
    // .populate('playersResults.player')
    // .populate('playersResults.results.rule')

    res.json({ result });
  });

  router.put('/results', async (req, res) => {
    const { results, matchId } = req.body;

    const matchResult = await MatchResultModel.findOneAndUpdate({ match_id: matchId }, { playersResults: results });

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

    await MatchResultModel.updateMany({'playersResults.playerId': playerId }, {
      $pull: { playersResults: { playerId: playerId } }
    });

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
    const user = await UserModel.findByIdAndUpdate(userId, req.body.user, { new: true });
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