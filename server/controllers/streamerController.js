import express from "express";
import PlayerModel from "../models/player";

import TournamentModel from '../models/tournament';
import TransactionModel from '../models/transaction';
import FantasyTournament from '../models/fantasy-tournament';
import MatchModel from '../models/match';
import MatchResultModel from '../models/match-result';
import UserModel from '../models/user';
import riotFetch from '../riotFetch';

import find from 'lodash/find';
import difference from 'lodash/difference';

import moment from 'moment';

let router = express.Router();

const StreamerController = (io) => {
  router.get('/', async (req, res) => {
    let players = await PlayerModel.find();
    res.json({ players });
  });

  router.post('/players', async (req, res) => {
    const { name, photo, position } = req.body;

    if (name.length > 20) {
      res.status(400).send({
        error: 'Name can not contain more than 20 characters',
      });

      return;
    }

    if (!position) {
      res.status(400).send({
        error: 'Position field is required',
      });

      return;
    }

    const isPlayerExist = await PlayerModel.findOne({ name });

    if (isPlayerExist) {
      res.status(400).send({ name });

      return;
    }

    let summonerRequest = await riotFetch(`lol/summoner/v4/summoners/by-name/${name}`);
    summonerRequest = await summonerRequest.json();

    if(summonerRequest.status && summonerRequest.status.status_code === 404){
      res.status(404).send({ name });

      return;
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

  router.get('/matches/last/:id', async (req, res) => {
    const accountId = req.params.id;

    let matchesList = await riotFetch(`lol/match/v4/matchlists/by-account/${accountId}`);
    matchesList = await matchesList.json();
    matchesList = matchesList.matches.slice(0, 5);

    let matchesIds = matchesList.map(match => match.gameId);
    let detailedMatches = [];

    for(let i = 0; i < matchesIds.length; i++){
      let match = await riotFetch(`lol/match/v4/matches/${matchesIds[i]}`);
      match = await match.json();

      detailedMatches.push(match);
    }

    res.json({
      success: 'true',
      matches: detailedMatches,
    });
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
    const { startDate, completed, lolMatchId, name, results } = req.body;

    // Match results update
    if (lolMatchId !== '') {
      let matchRequest = await riotFetch(`lol/match/v4/matches/${lolMatchId}`);
      matchRequest = await matchRequest.json();

      const match = await MatchModel.findOne({ _id: matchId });
      let matchResult = await MatchResultModel.findOne({ _id: match.resultsId }).populate('playersResults.player', 'name').lean().exec();

      // Check if players in match and in lol match results are the same
      const matchPlayersNames = matchResult.playersResults.map(item => item.player.name);
      const lolMatchPlayersNames = matchRequest.participantIdentities.map(item => item.player.summonerName);
      const playersDifference = difference(matchPlayersNames, lolMatchPlayersNames);

      if(playersDifference.length > 0){
        res.status(400).send({
          error: 'serverErrors.players_are_not_same',
        });

        return;
      }

      let lolMatchPlayers = [];
  
      for(let i = 0; i < matchRequest.participantIdentities.length; i++){
        const { kills, deaths, assists } = matchRequest.participants[i].stats;
        let playerName = matchRequest.participantIdentities[i].player.summonerName;
        let playerId = await PlayerModel.findOne({ name: playerName });
  
        const player = {
          _id: playerId._id,
          name: playerName,
          kills,
          deaths,
          assists,
        }
  
        lolMatchPlayers.push(player);
      }
  
      matchResult.playersResults.forEach(item => {
        const playerId = item.playerId;
        const lolPlayer = lolMatchPlayers.find(item => item._id == playerId);
        
        const lolPlayerScore = Object.values({
          kills: lolPlayer.kills,
          deaths: lolPlayer.deaths,
          assists: lolPlayer.assists,
        });
  
        item.results.forEach((result, index) => {
          result.score = lolPlayerScore[index];
        })
      })
  
      await MatchResultModel.findOneAndUpdate({ matchId }, { playersResults: matchResult.playersResults });
    } else {
      await MatchResultModel.findOneAndUpdate({ matchId }, { playersResults: results });
    }

    await MatchModel.findByIdAndUpdate(matchId, {
      name,
      startDate,
      completed,
    }, {
      new: true
    });

    const updatedMatch = await MatchModel.findOne({ _id: matchId })
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

    // io.emit('matchUpdated', { updatedMatch });

    res.json({
      success: 'success',
      updatedMatch
    });
  });

  router.post('/tournament', async (req, res) => {
    const { name, userId, entry, matches, thumbnail, playersIds, rulesValues } = req.body;

    const user = await UserModel.findOne({ _id: userId }, 'balance');

    if (user.balance - entry < 0) {
      res.json({
        success: false,
        message: 'You have not money on your balance to create tournament',
      });

      return;
    }

    await UserModel.findByIdAndUpdate({ _id: userId }, {new: true, $inc: { balance: entry * -1 }});

    await TransactionModel.create({
      userId,
      amount: entry,
      origin: 'tournament deposit',
      date: Date.now(),
    });

    let createdMatchesIds = [];

    const generatePlayersResults = (players) => {
      let results = [];
      const rulesIds = Object.keys(rulesValues);
      let rulesMock = rulesIds.map(item => ({ rule: item, score: 0 }));

      for (let i = 0; i < players.length; i++) {
        const playerResult = {
          playerId: players[i],
          results: rulesMock,
        }

        results.push(playerResult);
      }

      return results;
    }

    for (let i = 0; i < matches.length; i++) {
      const [ hours, minutes ] = matches[i].startTime.split(':');
      let matchDate = moment().hours(hours).minutes(minutes);

      const matchMock = {
        tournament_id: '',
        resultsId: '',
        name: matches[i].name,
        completed: false,
        startDate: matchDate,
        syncAt: matchDate,
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
      winner: null,
    });

    res.send({ fantasyTournament });
  });

  router.get('/tournament/:id/finalize', async (req, res) => {
    const tournamentId = req.params.id;

    const fantasyTournament = await FantasyTournament
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
        success: false,
        message: "Tournament is already finalized"
      });

      return;
    }

    if (fantasyTournament.users.length === 0) {
      res.json({
        success: false,
        message: "You can't finalize tournament without participants"
      });

      return;
    }

    const realTournament = fantasyTournament.tournament;

    const matches = realTournament.matches;
    const areMatchesCompleted = matches.every(match => match.completed === true);

    const rulesSet = fantasyTournament.rules.reduce((set, item) => {
      set[item.rule._id] = item.score;
      return set;
    }, {});

    let playersCountedResults = [];

    const getUserPlayers = (userId) => {
      const user = find(fantasyTournament.users, (item) => item.user._id === userId);
      return user.players;
    };

    const getCountMatchPoints = (matchId, userId) => {
      const userPlayers = getUserPlayers(userId);
      const userPlayersIds = userPlayers.map(player => player._id);

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
        success: false,
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

    await FantasyTournament.updateOne({ _id: tournamentId }, {
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

    const tournamentUserNames = fantasyTournament.users.map(item => item.user.username);

    io.emit('fantasyTournamentFinalized', {
      tournamentId,
      participants: tournamentUserNames,
      winner: tournamentWinner.user.username,
      prize: tournamentPrize,
    });

    res.json({
      message: "Finalization completed",
      success: "success",
    });
  });

  return router;
}

export default StreamerController;