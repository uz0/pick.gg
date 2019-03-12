import map from 'lodash/map';
import find from 'lodash/find';
import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournament from "../models/fantasy-tournament";
import UserModel from "../models/user";
import RuleModel from "../models/rule";
import TransactionModel from "../models/transaction";
import MatchResult from "../models/match-result";
import MatchModel from "../models/match";
import PlayerModel from "../models/player";
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import config from "../config";

import MockService from "../mockService";

import moment from 'moment';

let router = express.Router();

const SystemController = () => {

  router.get('/reset', async (req, res) => {

    await FantasyTournament.deleteMany();
    await TournamentModel.deleteMany();
    await MatchResult.deleteMany();
    await MatchModel.deleteMany();
    await PlayerModel.deleteMany();

    res.send({
      "success": "all data was resetted"
    })

  })

  router.get('/sync', async (req, res) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.client_id);
    params.append('client_secret', config.client_secret);

    let auth = await fetch('https://api.abiosgaming.com/v2/oauth/access_token', {
      method: 'POST',
      body: params,
    });

    auth = await auth.json();
    const token = auth.access_token;

    const getAbios = (endPoint, params) => {
      const url = `https://api.abiosgaming.com/v2/${endPoint}?access_token=${token}`;

      if (params) {
        const advancedParams = new URLSearchParams();
        Object.entries(params).map(([key, val]) => advancedParams.append(key, val));
        return fetch(`${url}&${advancedParams.toString()}`);
      }

      return fetch(url);
    };

    const loadPaginatedData = async (endPoint, params) => {
      console.log(`${endPoint} is loading`);
      let firstPage = await getAbios(endPoint, params);
      firstPage = await firstPage.json();
      console.log(`1 of ${firstPage.last_page} page loaded`);

      let list = firstPage.data;

      if (firstPage.last_page === 1) {
        return list;
      }

      const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));

      for (let i = 2; i < firstPage.last_page + 1; i++) {
        const advancedParams = Object.assign(params, { page: i });
        let response = await getAbios(endPoint, advancedParams);
        response = await response.json();

        if (!response.error) {
          console.log(`${i} of ${firstPage.last_page} page loaded`);
          list = list.concat(response.data);
        } else {
          console.log(`${i} of ${firstPage.last_page} page request error`);
          console.log(response);
        }

        await wait(350);
      }

      return list;
    };

    let game = await getAbios('games', { q: 'CS:GO' });
    game = await game.json();
    game = game.data[0];

    let formattedPlayers = [];
    let formattedTournaments = [];
    let formattedMatches = [];

    const countPlayers = await PlayerModel.count();

    if (countPlayers === 0) {
      const players = await loadPaginatedData('players', {'games[]': game.id});

      players.forEach(player => {
        formattedPlayers.push({
          id: player.id,
          name: player.nick_name,
          photo: player.images.default,
        });
      });

      await PlayerModel.deleteMany();
      console.log('Players model cleared');
      await PlayerModel.create(formattedPlayers);
      console.log('Players loaded');
    } else {
      console.log('Players loading skipped');
    }

    const series = await loadPaginatedData('series', {'games[]': game.id, 'with[]': 'matches'});
    const tournaments = await loadPaginatedData('tournaments', {'games[]': game.id, 'with[]': 'series'});

    for (let i = 0; i < tournaments.length; i++) {
      const tournament = tournaments[i];

      let object = {
        id: tournament.id,
        name: tournament.title,
        date: tournament.start,
        champions_ids: [],
        matches_ids: [],
      };

      if (tournament.series && tournament.series.length > 0) {
        for (let j = 0; j < tournament.series.length; j++) {
          let oneSeries = find(series, { id: tournament.series[j].id }) || tournament.series[j];

          if (oneSeries.matches && oneSeries.matches.length > 0) {
            oneSeries.matches.forEach(match => {
              formattedMatches.push({
                id: match.id,
                tournament_id: tournament.id,
                // в абиос нет даты у матча, вставил даты турнира
                startDate: tournament.start,
                endDate: tournament.end,
                results: null,
                completed: false,
              });

              object.matches_ids.push(match.id);
            });
          }

          if (oneSeries.rosters && oneSeries.rosters.length > 0) {
            oneSeries.rosters.forEach(roster => {
              roster.players.forEach(player => {
                object.champions_ids.push(player.id);
              });
            });
          }
        }
      }

      formattedTournaments.push(object);
    }

    await MatchModel.deleteMany();
    console.log('Matches cleared');
    await MatchModel.create(formattedMatches);
    console.log('Matches loaded');

    await TournamentModel.deleteMany();
    console.log('Tournaments cleared');
    await TournamentModel.create(formattedTournaments);
    console.log('Tournaments loaded');

    res.send({
      success: 'Sync successfully completed',
    });
  })

  router.get('/finalize', async (req, res) => {
    const tournaments = await FantasyTournament
      .find({ winner: null })
      .populate('tournament')

      .populate({
        path: 'tournament',

        populate: {
          path: 'matches',

          populate: {
            path: 'results'
          },
        },
      })

    const calculateChampionsPoints = params => {
      const { rules, results } = params;
      let sum = 0;

      results.forEach(result => {
        const initialRule = find(rules, { rule: result.rule });
        const multiple = initialRule.score * result.score;
        sum += multiple;
      });

      return sum;
    };

    for (let i = 0; i < tournaments.length; i++) {
      const matches = tournaments[i].tournament.matches;
      const rules = tournaments[i].rules;
      const users = tournaments[i].users;

      if (!matches || matches.length === 0) {
        continue;
      }

      if (!users || users.length === 0) {
        continue;
      }

      let isAllMatchesCompleted = true;

      for (let j = 0; j < matches.length; j++) {
        if (!matches[j].completed) {
          isAllMatchesCompleted = false;
        }
      }

      if (!isAllMatchesCompleted) {
        continue;
      }

      let championsPoints = {};

      tournaments[i].tournament.champions_ids.forEach(id => {
        championsPoints[id] = 0;
      });

      for (let j = 0; j < matches.length; j++) {
        matches[j].results.playersResults.forEach(result => {
          const points = calculateChampionsPoints({results: result.results, rules});
          championsPoints[result.playerId] += points;
        });
      }

      let winner = {
        points: 0,
        user: null,
      };

      for (let j = 0; j < users.length; j++) {
        let sum = 0;

        users[j].players_ids.forEach(id => {
          sum += championsPoints[id];
        });

        if (sum > winner.points) {
          winner = {
            points: sum,
            user: users[j].user,
          };
        }
      }

      const winnerSum = tournaments[i].entry * users.length;
      await UserModel.findByIdAndUpdate({ _id: winner.user }, {new: true, $inc: { balance: winnerSum }});
      await FantasyTournament.findByIdAndUpdate({ _id: tournaments[i]._id }, {winner: winner.user});

      await TransactionModel.create({
        userId: winner.user,
        amount: winnerSum,
        origin: 'tournament winning',
        date: Date.now(),
      });
    }

    res.send({ success: 'Success' });
  });

  router.get('/tournaments', async (req, res) => {
    const tournaments = await TournamentModel.find({})
    .populate('champions')
    .populate('matches')

    res.send({
      tournaments
    })
  })

  router.get('/createmock', async (req, res) => {
    const players = MockService.getChampions();
    let tournaments = MockService.getTournaments();
    let matches = [];
    let matchIndex = 1;
    const rules = await RuleModel.find();

    for (let i = 0; i < tournaments.length; i++) {
      const tournamentChampions = MockService.getRandomTournamentChampions();
      const tournamentMatches = MockService.generateTournamentMatches(tournaments[i].id);
      tournaments[i].champions_ids = map(tournamentChampions, champion => champion.id);

      for (let j = 0; j < tournamentMatches.length; j++) {
        tournamentMatches[j].id = matchIndex;

        const results = MockService.generatePlayersResults({
          match_id: matchIndex,
          tournament: tournaments[i],
          rules,
        });

        const createdResult = await MatchResult.create({
          matchId: matchIndex,
          playersResults: tournamentMatches[j].completed ? results : [],
        });

        tournamentMatches[j].results = createdResult._id;
        matchIndex++;
      }

      tournaments[i].matches_ids = map(tournamentMatches, match => match.id);
      matches = matches.concat(tournamentMatches);
    }

    await PlayerModel.create(players);
    await MatchModel.create(matches);
    await TournamentModel.create(tournaments);

    res.send({
      success: 'Success',
    });
  })
  
  return router;
}

export default SystemController