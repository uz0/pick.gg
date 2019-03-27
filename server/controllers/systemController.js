import map from 'lodash/map';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';
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
    console.log('matches loading');
    let data = await fetch('https://esports-api.thescore.com/lol/matches');
    data = await data.json();
    console.log('matches loaded');

    let formattedTournaments = [];
    let formattedMatches = [];
    let formattedMatchResults = [];
    let formattedPlayers = [];

    data.competitions.forEach(competition => {
      formattedTournaments.push({
        id: competition.id,
        name: competition.full_name,
        date: null,
        matches: [],
        champions: [],
        syncAt: new Date().toISOString(),
      });
    });

    data.matches.forEach(match => {
      formattedMatches.push({
        id: match.id,
        tournament_id: parseInt(match.competition_url.replace('/lol/competitions/', ''), 10),
        startDate: match.start_date,
        results: null,
        completed: false,
        syncAt: new Date().toISOString(),
      });
    });

    const groupedMatches = groupBy(formattedMatches, 'tournament_id');

    Object.keys(groupedMatches).forEach(id => {
      const tournamentIndex = findIndex(formattedTournaments, { id: groupedMatches[id][0].tournament_id });
      formattedTournaments[tournamentIndex].matches = map(groupedMatches[id], match => match.id);
      formattedTournaments[tournamentIndex].date = groupedMatches[id][0].startDate;
    });

    const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));
    console.log('matches details loading');

    for (let i = 0; i < formattedMatches.length; i++) {
      await wait(500);
      let response = await fetch(`https://esports-api.thescore.com/lol/matches/${formattedMatches[i].id}`);
      response = await response.json();

      response.players.forEach(player => {
        if (!find(formattedPlayers, { id: player.id })) {
          formattedPlayers.push({
            id: player.id,
            name: player.in_game_name,
            photo: player.headshot ? player.headshot.w192xh192 : null,
            syncAt: new Date().toISOString(),
          });
        }

        const tournamentIndex = findIndex(formattedTournaments, { id: formattedMatches[i].tournament_id });

        if (formattedTournaments[tournamentIndex].champions.indexOf(player.id) === -1) {
          formattedTournaments[tournamentIndex].champions.push(player.id);
        }
      });

      formattedMatches[i].completed = response.matches.status === 'post-match';

      if (formattedMatches[i].completed) {
        let object = {
          matchId: formattedMatches[i].id,
          playersResults: [],
          syncAt: new Date().toISOString(),
        };

        response.player_game_records.forEach(record => {
          object.playersResults.push({
            playerId: parseInt(record.player_url.replace('/lol/players/', ''), 10),

            results: [
              {
                rule: 'assists',
                score: record.assists,
              },

              {
                rule: 'deaths',
                score: record.deaths,
              },

              {
                rule: 'kills',
                score: record.kills,
              },

              {
                rule: 'creep_score',
                score: record.creep_score,
              },

              {
                rule: 'net_worth',
                score: record.net_worth,
              },
            ],
          });
        });

        formattedMatchResults.push(object);

        // тут внесение результатов в модель и получение id для связки данных
        // этот кусок кода не тестировал

        // const resultsResponse = await MatchResult.create(object);
        // formattedMatches[i].results = resultsResponse._id;
      }

      console.log(`${i} of ${formattedMatches.length} matches loaded`);
    }

    res.send({
      formattedTournaments,
      formattedMatches,
      formattedMatchResults,
      formattedPlayers,
    });
  })

  router.get('/delete/:id', async (req, res) => {
    const id = req.param.id;
    await FantasyTournament.deleteOne({_id: id})
    res.send({
      id,
      success: "success"
    })
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
        tournamentId: tournaments[i]._id,
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