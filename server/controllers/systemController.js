import find from 'lodash/find';
import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournament from "../models/fantasy-tournament";
import UserModel from "../models/user";
import RuleModel from "../models/rule";
import TransactionModel from "../models/transaction";
import MatchResult from "../models/match-result";
import MatchModel from "../models/match";
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

import MockService from "../mockService";

import moment from 'moment';

let router = express.Router();

const SystemController = () => {

  router.get('/reset', async (req, res) => {

    await FantasyTournament.deleteMany();
    await TournamentModel.deleteMany();
    await MatchResult.deleteMany();
    await MatchModel.deleteMany();

    res.send({
      "success": "all data was resetted"
    })

  })

  router.get('/sync', async (req, res) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', 'hyperloot');
    params.append('client_secret', 'ef8bfd1fb62ecca4354ab6f4f1852cd986831b79b97e5e3478');

    let auth = await fetch('https://api.abiosgaming.com/v2/oauth/access_token', {
      method: 'POST',
      body: params,
    });

    auth = await auth.json();
    const token = auth.access_token;

    const getAbios = (endPoint, params) => {
      const url = `https://api.abiosgaming.com/v2/${endPoint}?access_token=${token}`;

      if (params) {
        const string = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');
        return fetch(`${url}&${string}`);
      }

      return fetch(url);
    };

    const loadPaginatedData = async (endPoint, params) => {
      let firstPage = await getAbios(endPoint, params);
      firstPage = await firstPage.json();

      let list = firstPage.data;

      if (firstPage.last_page === 1) {
        return list;
      }

      let promises = [];
      let timeout = 0;

      for (let i = 2; i < firstPage.last_page + 1; i++) {
        const advancedParams = Object.assign(params, { page: i });

        const promise = new Promise(resolve => {
          setTimeout(() => getAbios(endPoint, advancedParams).then(data => {
            data.json().then(response => resolve(response.data));
          }), timeout);
        });

        promises.push(promise);
        timeout += 500;
      }

      const response = await Promise.all(promises);

      response.forEach(item => {
        list = [...list, ...item];
      });

      return list;
    };

    let game = await getAbios('games', { q: 'CS:GO' });
    game = await game.json();
    game = game.data[0];

    const tournaments = await loadPaginatedData('tournaments', {'games[]': game.id, 'with[]': 'series'});
    const series = await loadPaginatedData('series', {'games[]': game.id, 'with[]': 'matches'});
    const players = await loadPaginatedData('players', {'games[]': game.id});

    let formattedTournaments = [];
    let formattedPlayers = [];

    players.forEach(player => {
      formattedPlayers.push({
        // в модели нет id, надо бы добавить наверное
        id: player.id,
        name: player.nick_name,
        photo: player.images.default,
      });
    });

    tournaments.forEach(tournament => {
      let object = {
        // тоже нет в модели id
        id: tournament.id,
        name: tournament.title,
        date: tournament.start,
        champions: [],
        matches: [],
      };

      if (tournament.series && tournament.series.length > 0) {
        tournament.series.forEach(oneSeries => {
          if (oneSeries.rosters && oneSeries.rosters.length > 0) {
            oneSeries.rosters.forEach(roster => {
              roster.players.forEach(player => {
                object.champions.push(player.id);
              });
            });
          }
        });
      }

      formattedTournaments.push(object);
    });

    res.send({
      formattedTournaments,
      formattedPlayers,
    });
  })

  router.get('/finalize', async (req, res) => {

    // here we will store refs of the tournaments without winner and finished matches
    let finishedTournaments = [];

    // Query all tournaments without winner
    const tournaments = await FantasyTournament
      .find({ winner: null })
      .populate('tournament')
      .populate('rules.rule')
      .populate({ path: 'users.players', select: 'name' })
      .populate({ path: 'users.user', select: '_id username' })
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
          },
        }
      })


    // Filter tournaments, leaving only finished ones
    tournaments.forEach(tournament => {

      // presume that all matches of the tournament are finished
      let allMatchesCompleted = true;

      tournament.tournament.matches.forEach(match => {
        if(!match.completed){
          allMatchesCompleted = false;
        }
      })

      if (allMatchesCompleted){
        // finishedTournaments.push(tournament)
        finishedTournaments.push({
          _id: tournament._id,
          users: tournament.users,
          matches: tournament.tournament.matches,
          rules: tournament.rules,
        })
      }

    })

    const findTournamentWinner = (tournament) => {

      const users = tournament.users;
      const usersResults = [];

    }


    finishedTournaments.forEach(tournament => {
      findTournamentWinner(tournament);
    })

    res.send({
      // tournaments,
      finishedTournaments,
      // tournament, 
    })

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

    let tournamentRef = '';
    let tournamentChampions = [];

    let championsResults = () => tournamentChampions.map(item => {
      let result = MockService.generatePlayerResult(item);
      return result;
    })

    let matches = [];
    let matchesRefs = [];

    let matchResults = [];
    let matchResultsRefs = [];

    const matchDateGap = 150000; // <- this equals 7.5 minutes
    const tournamentDateGap = 86400000; // <- this equals 1 day

    const tournament = await TournamentModel.create({
      name: MockService.getRandomTournamentName(),
      // date: Date.now() + 86400000,
      date: moment.now(),
      champions: MockService.getRandomTournamentChampions(),
    })

    const createdTournament = await TournamentModel.find({}).sort({_id:-1}).limit(1).populate('champions');
    
    tournamentRef = createdTournament[0]._id;
    tournamentChampions = createdTournament[0].champions.map(item => item.name);
    
    // matches array
    for(let i = 0; i <= 5; i++){

      matches.push({
        tournament: tournamentRef,
        startDate: (Date.now() - matchDateGap) + matchDateGap * i,
        endDate: Date.now() + matchDateGap * i,
        // date: Date.now() + 86400000 + (matchDateGap * i) - 900000,
        completed: false,
      })

    }
    
    await MatchModel.insertMany(matches)
    
    const insertedMatches = await MatchModel.find({}).sort({_id:-1}).limit(5);

    matchesRefs = insertedMatches.map(item => item._id);
    
    // match results array
    for(let i = 0; i <= 5; i++){

      matchResults.push({
        matchId: matchesRefs[i],
        playersResults: championsResults(),
      })

    }

    await MatchResult.insertMany(matchResults)

    const insertedResults = await MatchResult.find({}).sort({_id:-1}).limit(5);

    matchResultsRefs = insertedResults.map(item => { 
      return item._id
    });

    for(let i = 0; i <= 5; i++){
      await MatchModel.update({ _id: matchesRefs[i] }, { results: matchResultsRefs[i]})
    }

    await TournamentModel.findByIdAndUpdate(tournamentRef, { matches: matchesRefs })

    const newTournament = await TournamentModel.find({}).sort({_id:-1}).limit(1)
      .populate('champions')
      .populate('matches')
      .populate({
        path: 'matches',
        populate: {
          path: 'results',
          model: 'MatchResult',
          select: 'playersResults'
        }
      });

    res.send({
      "success": "success",
      newTournament
    });

  })
  
  return router;
}

export default SystemController