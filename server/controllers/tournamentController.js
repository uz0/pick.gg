import mongoose from "mongoose";
import express from "express";
import moment from "moment";
import find from 'lodash/find';
import TournamentModel from "../models/tournament";
import FantasyTournament from "../models/fantasy-tournament";
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

  router.get('/real', async (req, res) => {
    const tournaments = await TournamentModel
      .find({
        // date: {$lt: moment().toISOString()},
      })
      .populate('champions')
      .populate('matches')

    res.send({
      tournaments,
    });
  })

  router.get('/fantasy', async (req, res) => {
    const tournaments = await FantasyTournament.find({})
      .populate('tournament', 'name date')
      .populate({ path: 'users.players', select: 'id name' })
      .populate({ path: 'users.user', select: '_id username' })
      .sort({date: -1})

    res.send({
      tournaments,
    })

  })

  router.get('/', async (req, res) => {
    const tournaments = await FantasyTournament
      .find({})
      .populate('tournament', 'name date')
      .populate({ path: 'users.players', select: 'id name' })
      .populate({ path: 'users.user', select: '_id username' })
      .sort({date: -1})

    res.json({ tournaments });
  });

  router.get('/my', async (req, res) => {
    const id = req.decoded._id;
    const tournaments = await FantasyTournament
      .find({'users.user': id}, '-users.players -rules')
      .populate('tournament', 'name date')

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

    const tournament = await FantasyTournament
      .findOne({ _id: id })
      .populate({ path: 'users.players', select: 'id name photo' })
      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')
      .populate('tournament')
      .populate({ path: 'winner', select: 'id username' })
      .populate({ path: 'creator', select: 'id username' })
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
      })

    res.json({ tournament });

  });

  router.post('/', async (req, res) => {
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
      
      const newTournament = await FantasyTournament.create({
        tournament_id: tournamentId,
        name,
        entry,
        rules,
        creator: userId,
        winner: null,
      });

      await UserModel.findByIdAndUpdate({ _id: userId }, {new: true, $inc: { balance: entry * -1 }});

      await TransactionModel.create({
        userId,
        tournamentId: newTournament._id,
        amount: entry,
        origin: 'tournament deposit',
        date: Date.now(),
      });

      res.json({
        success: true,
        newTournament,
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

    const tournament = await FantasyTournament.findOne({ _id: id });
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

    if (`${tournament.creator}` !== `${userId}`) {
      if(user.balance < tournament.entry){
        res.json({
          success: false,
          message: "You have not enough money to take part in this tournament",
        });
      } else {
        await UserModel.findByIdAndUpdate({ _id: userId }, {new: true, $inc: { balance: tournament.entry * -1 }});
      }
    }

    tournamentUsers.push({
      userId,
      user: userId,
      players_ids: players,
    });

    const newTournament = await FantasyTournament
      .findOneAndUpdate({ _id: id }, { users: tournamentUsers }, { new: true })
      .populate({ path: 'users.user', select: '_id username' })
      .populate({ path: 'users.players' })

    res.json({
      success: true,
      tournament: newTournament,
    });
  });

  return router;
}

export default TournamentController;