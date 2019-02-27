import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournament from "../models/fantasy-tournament";
import UserModel from "../models/user";
import RuleModel from "../models/rule";
import TransactionModel from "../models/transaction";
import MatchResult from "../models/match-result";
import MatchModel from "../models/match";

import MockService from "../mockService";


let router = express.Router();

const SystemController = () => {

  router.get('/sync', async (req, res) => {

    // await TournamentModel.deleteMany();
    // await MatchResult.deleteMany();
    // await MatchModel.deleteMany();

    let tournamentRef = '';
    let tournamentChampions = [];

    const tournament = await TournamentModel.create({
      name: MockService.getRandomTournamentName(),
      date: Date.now(),
      champions: MockService.getRandomTournamentChampions()
    })

    const createdTournament = await TournamentModel.find({}).sort({_id:-1}).limit(1).populate('champions');

    tournamentRef = createdTournament[0]._id;
    tournamentChampions = createdTournament[0].champions.map(item => item.name);

    let championsResults = () => tournamentChampions.map(item => {
      let result = MockService.generatePlayerResult(item);
      return result;
    })


    // matches array
    let matches = [];
    let matchesRefs = [];

    for(let i = 0; i <= 3; i++){

      matches.push({
        tournament: tournamentRef,
        date: Date.now(),
        completed: false,
      })

    }

    await MatchModel.insertMany(matches)
    
    const insertedMatches = await MatchModel.find({}).sort({_id:-1}).limit(3);
    
    matchesRefs = insertedMatches.map(item => item._id);
    
    // match results array
    let matchResults = [];
    let matchResultsRefs = [];

    for(let i = 0; i <= 3; i++){

      matchResults.push({
        matchId: matchesRefs[i],
        playersResults: championsResults(),
      })

    }

    await MatchResult.insertMany(matchResults)

    const insertedResults = await MatchResult.find({}).sort({_id:-1}).limit(3);

    matchResultsRefs = insertedResults.map(item => { 
      return item._id
    });

    await MatchModel.update({ _id: matchesRefs[0] }, { results: matchResultsRefs[0]})
    await MatchModel.update({ _id: matchesRefs[1] }, { results: matchResultsRefs[1]})
    await MatchModel.update({ _id: matchesRefs[2] }, { results: matchResultsRefs[2]})

    await TournamentModel.findByIdAndUpdate(tournamentRef, { matches: matchesRefs })

    await TournamentModel.find({}).sort({_id:-1}).limit(1).populate('champions');

    let newTournament = await TournamentModel.find({}).sort({_id:-1}).limit(1)
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
  

  router.get('/finalize', async (req, res) => {});

  return router;
}

export default SystemController