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
    let data = await fetch('https://esports-api.thescore.com/lol/matches?start_date_from=2019-03-22T21:00:00Z');
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
        matches_ids: [],
        champions: [],
        champions_ids: [],
        syncAt: new Date().toISOString(),
        syncType: 'auto',
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
        syncType: 'auto',
      });
    });

    const groupedMatches = groupBy(formattedMatches, 'tournament_id');

    Object.keys(groupedMatches).forEach(id => {
      const tournamentIndex = findIndex(formattedTournaments, { id: groupedMatches[id][0].tournament_id });
      formattedTournaments[tournamentIndex].matches_ids = map(groupedMatches[id], match => match.id);
      formattedTournaments[tournamentIndex].date = groupedMatches[id][0].startDate;
    });

    const wait = time => new Promise(resolve => setTimeout(() => resolve(), time));
    console.log('matches details loading');

    for (let i = 0; i < formattedMatches.length; i++) {
      await wait(300);
      let response = await fetch(`https://esports-api.thescore.com/lol/matches/${formattedMatches[i].id}`);
      response = await response.json();

      response.players.forEach(player => {
        if (!find(formattedPlayers, { id: player.id })) {
          formattedPlayers.push({
            id: player.id,
            name: player.in_game_name,
            photo: player.headshot ? player.headshot.w192xh192 : null,
            syncAt: new Date().toISOString(),
            syncType: 'auto',
          });
        }

        const tournamentIndex = findIndex(formattedTournaments, { id: formattedMatches[i].tournament_id });

        if (formattedTournaments[tournamentIndex].champions_ids.indexOf(player.id) === -1) {
          formattedTournaments[tournamentIndex].champions_ids.push(player.id);
        }
      });

      formattedMatches[i].completed = response.matches.status === 'post-match';

      if (formattedMatches[i].completed) {
        let object = {
          matchId: formattedMatches[i].id,
          playersResults: [],
          syncAt: new Date().toISOString(),
          syncType: 'auto',
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

        const match = await MatchModel.find({id: object.matchId});

        if(match.length === 0){
          const resultsResponse = await MatchResult.create(object);
          formattedMatches[i].resultsId = resultsResponse._id;
          formattedMatchResults[i].resultsId = resultsResponse._id;

          console.log(`Result with id ${resultsResponse.id} was created`);
        }

        if(match.length > 0){
          const resultsResponse = await MatchResult.findOneAndUpdate({matchId: match[0].id}, object, {new: true});

          formattedMatches[i].resultsId = resultsResponse._id;
          formattedMatchResults[i].resultsId = resultsResponse._id;

          console.log(`Result with id ${resultsResponse.id} was updated`);
        }

      }

      console.log(`${i} of ${formattedMatches.length} matches loaded`);
    }

    // Если матчей нет в нашей базе - то добавляем, если есть - обновляем
    console.log('Begin matches sync');
    const formattedMatchesIds = formattedMatches.map(matches => matches.id);

    const matchesInBase = await MatchModel.find({id: {$in: formattedMatchesIds}})
    const matchesInBaseIds = matchesInBase.map(match => match.id);

    const matchesNotAddedToBase = formattedMatches.filter(item => !matchesInBaseIds.includes(item.id));
    const matchesToUpdate = formattedMatches.filter(item => matchesInBaseIds.includes(item.id));

    for(let i = 0; i < matchesNotAddedToBase.length; i++){
      await MatchModel.create(matchesNotAddedToBase[i]);
      console.log(`Match ${i} of ${matchesNotAddedToBase.length - 1} has been created`);
    }

    for(let i = 0; i < matchesToUpdate.length; i++){
      const matchId = matchesToUpdate[i].id;

      await MatchModel.update({id: matchId}, matchesToUpdate[i]);
      console.log(`Match ${i} of ${matchesNotAddedToBase.length - 1} has been updated`);
    }
    console.log('End matches sync');

    // Маппим результаты к матчам
    console.log('Begin matches results sync');
    for(let i = 0; i < formattedMatchResults.length; i++){
      const matchId = formattedMatchResults[i].matchId;
      const resultsId = formattedMatchResults[i].resultsId;
      
      await MatchModel.update({ id: matchId }, { resultsId });
      
      console.log(`Mapped ${i} results from ${formattedMatchResults.length - 1}`);
    }
    console.log('End matches results sync');

    // Если игроков нет в нашей базе - то добавляем, если есть - обновляем
    console.log('Begin players sync');
    const formattedPlayersIds = formattedPlayers.map(player => player.id);

    const playersInBase = await PlayerModel.find({id: {$in: formattedPlayersIds}});
    const playersInBaseIds = playersInBase.map(player => player.id);

    const playersNotAddedToBase = formattedPlayers.filter(item => !playersInBaseIds.includes(item.id));
    const playersToUpdate = formattedPlayers.filter(item => playersInBaseIds.includes(item.id));

    for(let i = 0; i < playersNotAddedToBase.length; i++){
      const player = await PlayerModel.create(playersNotAddedToBase[i]);
      console.log(`Player with id ${player.id} has been created`);
    }

    for(let i = 0; i < playersToUpdate.length; i++){
      const playerId = playersToUpdate[i].id;

      await PlayerModel.update({id: playerId}, playersToUpdate[i]);
      console.log(`Player with id ${playerId} was updated`);
    }
    console.log('End players sync');

    // Если турниров нет в нашей базе - то добавляем, если есть - обновляем
    console.log('begin tournaments sync');
    const formattedTournamentsIds = formattedTournaments.map(tournament => tournament.id);

    const tournamentsInBase = await TournamentModel.find({id: {$in: formattedTournamentsIds}});
    const tournamentsInBaseIds = tournamentsInBase.map(tournament => tournament.id);

    const tournamentsNotAddedToBase = formattedTournaments.filter(item => !tournamentsInBaseIds.includes(item.id));
    const tournamentsToUpdate = formattedTournaments.filter(item => tournamentsInBaseIds.includes(item.id));

    
    for(let i = 0; i < tournamentsNotAddedToBase.length; i++){
      const tournament = await TournamentModel.create(tournamentsNotAddedToBase[i]);
      console.log(`Tournament with id ${tournament.id} has been created`);
    }

    for(let i = 0; i < tournamentsToUpdate.length; i++){
      const tournamentId = tournamentsToUpdate[i].id;

      await TournamentModel.update({id: tournamentId}, tournamentsToUpdate[i]);
      console.log(`Tournament with id ${tournamentId} was updated`);
    }
    console.log('end tournaments sync');

    res.send({
      formattedTournaments,
      formattedMatches,
      formattedMatchResults,
      formattedPlayers,
    });
  });

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