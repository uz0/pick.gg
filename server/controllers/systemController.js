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

  router.get('/reset', async (req, res) => {

    await FantasyTournament.deleteMany();
    await TournamentModel.deleteMany();
    await MatchResult.deleteMany();
    await MatchModel.deleteMany();

    res.send({
      "success": "real tournaments were resetted"
    })

  })

  router.get('/sync', async (req, res) => {

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

    const matchDateGap = 3600000; // <- this equals 1 hour
    const tournamentDateGap = 86400000; // <- this equals 1 day

    const tournament = await TournamentModel.create({
      name: MockService.getRandomTournamentName(),
      date: Date.now() + tournamentDateGap,
      champions: MockService.getRandomTournamentChampions()
    })

    const createdTournament = await TournamentModel.find({}).sort({_id:-1}).limit(1).populate('champions');
    const insertedMatches = await MatchModel.find({}).sort({_id:-1}).limit(3);
    const insertedResults = await MatchResult.find({}).sort({_id:-1}).limit(3);

    tournamentRef = createdTournament[0]._id;
    tournamentChampions = createdTournament[0].champions.map(item => item.name);

    // matches array
    for(let i = 0; i <= 3; i++){

      matches.push({
        tournament: tournamentRef,
        date: Date.now() + (matchDateGap * i),
        completed: false,
      })

    }

    await MatchModel.insertMany(matches)
    
    matchesRefs = insertedMatches.map(item => item._id);
    
    // match results array
    for(let i = 0; i <= 3; i++){

      matchResults.push({
        matchId: matchesRefs[i],
        playersResults: championsResults(),
      })

    }

    await MatchResult.insertMany(matchResults)

    matchResultsRefs = insertedResults.map(item => { 
      return item._id
    });

    for(let i = 0; i <= 3; i++){
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
  

  router.get('/finalize', async (req, res) => {});

  return router;
}

export default SystemController