import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournament from "../models/fantasy-tournament";
import UserModel from "../models/user";
import RuleModel from "../models/rule";
import TransactionModel from "../models/transaction";
import MatchResult from "../models/match-result";
import MatchModel from "../models/match";

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

    // Some good code to sync all matches and tournaments
    // const matches = await MatchModel.find()
    const matches = await MatchModel.update({ endDate: { $lte: Date.now() } }, { completed: true }, { multi: true })

    res.send({
      matches
    })

  })

  router.get('/finalize', async (req, res) => {

    const countUserResultById = () => {

    }

    // const fantasy tornaments
    // const tournaments = await FantasyTournament.aggregate([
    //   {
    //     $match: {
    //       winner: null
    //     }
    //   },
    // ])

    let uncompletedTournamentsRef = [];

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
        }
      }, (err, doc) => {
        console.log(doc)
        return doc
      })


    // const tournament = await FantasyTournament.find({_id:"5c7a3a102edeb71dcc5f3b63"})

      // .find({ winner: null })
      // .populate('tournament')
      // .populate({
      //   path: 'tournament',
      //   populate: {
      //     path: 'matches',
      //     populate: {
      //       path: 'results'
      //     }
      //   }
      // })





    res.send({
      tournaments,
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