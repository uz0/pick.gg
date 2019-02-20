import mongoose from "mongoose";
import express from "express";
import moment from "moment";
import find from 'lodash/find';
import TournamentModel from "../models/tournament";
import UserModel from "../models/user";
import TransactionModel from "../models/transaction";

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

  router.get('/', async (req, res) => {
    // const userId = req.decoded._id;

    const tournaments = await TournamentModel
      .find({}, '-users.players')
      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')

    res.json({ tournaments });
  });

  router.get('/my', async (req, res) => {
    const id = req.params.id;

    const tournaments = await TournamentModel
      .find({
        'users.user._id': id,
      }, '-users.players')

      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')

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
      .findOne({ _id: id }, '-users.players')
      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')

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

      const tournament = await TournamentModel.findOne({ _id: newTournament.id }).populate('rules.rule');
      // list.push(tournament);
      // io.emit('tournaments', { tournaments: list });

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

    const tournament = await TournamentModel.findOne({ _id: id }, 'users date');

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

    tournamentUsers.push({
      userId,
      user: userId,
      players,
    });

    const newTournament = await TournamentModel
      .findOneAndUpdate({ _id: id }, { users: tournamentUsers }, { new: true, fields: '-users.players' })
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