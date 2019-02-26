import mongoose from "mongoose";
import express from "express";
import moment from "moment";
import find from 'lodash/find';
import TournamentModel from "../models/tournament";
import UserModel from "../models/user";
import RuleModel from "../models/rule";
import TransactionModel from "../models/transaction";
import MatchResult from "../models/match-result";
import MatchModel from "../models/match";

let router = express.Router();

let list = [];

const TournamentController = io => {
  // io.on('connection', async socket => {
  //   const tournaments = await TournamentModel
  //     .find()
  //     .populate('rules.rule')
  //     .populate({ path: 'users.user', select: '_id username' })
  //     .populate('users.players');

  //   list = tournaments;
  //   socket.emit('tournaments', { tournaments: list });
  // });

  router.get('/modify', async (req, res) => {

    // 5c71a33d4361e113fcced261

    // await MatchModel.create({
    //   tournament: "5c71a33d4361e113fcced261",
    //   date: Date.now(),
    //   completed: true,
    // })

    // const matches = await MatchModel.find({tournament: "5c74dcaed403d31a54cce449"}).populate('results')
    // const results = await MatchResult.find({_id: "5c74d8690ce66b1df09d0ac6"});

    await TournamentModel.deleteOne({_id: "5c74dc4bc8ceef17ec0b27f7"})
    await TournamentModel.deleteOne({_id: "5c74d8680ce66b1df09d0ac3"})
    await TournamentModel.deleteOne({_id: "5c74dea7a5296d1f78fd9af9"})
    // await TournamentModel.deleteOne({_id: "5c746760b87d452204313cd0"})
    

    // await MatchModel.deleteMany({tournament: "5c74d8680ce66b1df09d0ac3"})
    // const matches = await MatchModel.find();

    res.send({
      "matches":"success",
    })

  })

  router.get('/', async (req, res) => {
    const tournaments = await TournamentModel
      .find({})
      // .populate('users', 'id')
      .populate({ path: 'users.players', select: '_id name' })
      .populate({ path: 'users.user', select: '_id username' })
      .sort({date: -1})

    // const tournaments = await TournamentModel.deleteOne({name: "CSGO"})

    res.json({ tournaments });
  });

  router.get('/my', async (req, res) => {
    const id = req.decoded._id;
    const tournaments = await TournamentModel
      .find({'users.user': id}, '-users.players -rules')

    res.json({ tournaments });
  });

  router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const tournaments = await TournamentModel
    .find({'users.user': id}, '-rules -users.players')

    res.json({ tournaments });
  });

  router.get('/myended', async (req, res) => {
    const id = req.params.id;
    const yesterday = moment().utc().endOf('day').subtract(1, 'days').toISOString();

    const tournaments = await TournamentModel
      .find({
        'users.user._id': id,
        date: {$lt: yesterday},
      }, '-users.players')

      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')

    res.json({ tournaments });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const tournament = await TournamentModel
      .findOne({ _id: id })
      .populate({ path: 'users.players', select: 'name photo' })
      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')
      .populate('matches')
      .populate({
        path: 'matches',
        populate: {
          path: 'results',
          model: 'MatchResult',
          select: 'playersResults'
        }
      })

    res.json({ tournament });

  });

  router.post('/', async (req, res) => {
    // await TournamentModel.deleteMany({})
    // return;
    const {
      tournamentId,
      name,
      entry,
      rules,
    } = req.body;

    const userId = req.decoded._id;

    let message = '';

    if (!tournamentId) {
      message = 'Enter tournament';
    }

    if (!name) {
      message = 'Enter name';
    }

    if (!entry) {
      message = 'Enter entry price';
    }

    if (!rules) {
      message = 'Enter rules';
    }

    if (message) {
      res.json({
        success: false,
        message,
      });

      return;
    }

    const user = await UserModel.findOne({ _id: userId }, 'balance');

    if (user.balance - entry < 0) {
      res.json({
        success: false,
        message: 'You have not money on your balance to create tournament',
      });

      return;
    }

    try {
      await UserModel.findByIdAndUpdate({ _id: userId }, {new: true, $inc: { balance: entry * -1 }});

      await TransactionModel.create({
        userId,
        amount: entry,
        origin: 'tournament deposit',
        date: Date.now(),
      });

      const newTournament = await TournamentModel.create({
        tournamentId,
        name,
        entry,
        rules,
        date: Date.now(),
      });

      // mocking matches and results
      let dateGap = 2400;
      for(let i = 0; i < 4; i++){
        await MatchModel.create({
          tournament: newTournament.id,
          date: Date.now() + (dateGap * i),
          completed: i < 6 ? true : false
        })
      }
  
      const createdMatches = await MatchModel.find({tournament: newTournament.id})
      const createdMatchesId = createdMatches.map(match => match._id);

      let rulesList = await TournamentModel.find({_id: newTournament.id}).populate('rules.rule');
      let filteredRules = rulesList[0].rules.filter(item => item.rule !== null);
      
      let playersNames = ['s1mple', 'Zeus', 'electronic', 'Edward', 'flamie', 'hitMouse', 'seized', 'f0rest', 'Xyp9x', 'flusha'];
      let random = () => Math.floor(Math.random() * 9) + 1;
      let resultsRandomValues = [1, 9, 8, 11, 12, 15, 7, 6, 3, 4, 13];
  
      createdMatchesId.forEach(async(item, index) => {
        
        let playersResults = [];
        
        for(let i = 0; i < playersNames.length; i++){
          let result = {}
              result.name = playersNames[i]
    
          filteredRules.forEach(item => {
            let name = item.rule.name;
            result[name] = resultsRandomValues[random()]
          })
    
          playersResults.push(result);
        }
  
        const matchResult = await MatchResult.create({
          matchId: item,
          playersResults: playersResults,
        })

        await MatchModel.findByIdAndUpdate(item, {results: matchResult._id})

        await TournamentModel.findByIdAndUpdate(newTournament.id, {$push: { matches: item}})

      })

      console.log(createdMatches, createdMatchesId);
      
      const tournament = await TournamentModel.findOne({ _id: newTournament.id })
        .populate('rules.rule')
        .populate('matches')
        // .populate({
        //   path: 'matches',
        //   populate: {
        //     path: 'results',
        //     model: 'MatchResult',
        //     select: 'playersResults'
        //   }
        // })

      res.json({
        success: true,
        tournament,
      });
    } catch (error) {
      res.json({
        success: false,
        error,
      });
    }
  });

  router.post('/:id/setup', async (req, res) => {
    const id = req.params.id;
    const players = req.body.players;
    const userId = req.decoded._id;

    const tournament = await TournamentModel.findOne({ _id: id });
    const user = await UserModel.findOne({ _id: userId })

    if (moment(tournament.date).isAfter(moment())) {
      res.json({
        success: false,
        message: 'The tournament is already underway or has been completed',
      });

      return;
    }

    let tournamentUsers = tournament.users;

    if (find(tournamentUsers, user => `${user.user}` === userId)) {
      res.json({
        success: false,
        message: "You're already taking part in this championship",
      });

      return;
    }

    if(user.balance < tournament.entry){
      res.json({
        success: false,
        message: "You have not enough money to take part in this tournament",
      });
    } else {
      await UserModel.findByIdAndUpdate({ _id: userId }, {new: true, $inc: { balance: tournament.entry * -1 }});
    }

    tournamentUsers.push({
      userId,
      user: userId,
      players,
    });

    const newTournament = await TournamentModel
      .findOneAndUpdate({ _id: id }, { users: tournamentUsers }, { new: true })
      .populate({ path: 'users.user', select: '_id username' })

    // const listTournamentIndex = _.findIndex(list, item => `${item._id}` === `${id}`);
    // list[listTournamentIndex] = newTournament;
    // io.emit('tournaments', { tournaments: list });

    res.json({
      success: true,
      tournament: newTournament,
    });
  });

  return router;
}

export default TournamentController;