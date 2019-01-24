import mongoose from "mongoose";
import express from "express";
import _ from 'lodash';
import TournamentModel from "../models/tournament";

let router = express.Router();

let list = [];

const TournamentController = io => {
  io.on('connection', async socket => {
    const tournaments = await TournamentModel
      .find()
      .populate('rules.rule')
      .populate({ path: 'users', select: '_id username' });

    list = tournaments;
    socket.emit('tournaments', { tournaments: list });
  });

  router.get('/', async (req, res) => {
    const tournaments = await TournamentModel
      .find()
      .populate('rules.rule')
      .populate({ path: 'users', select: '_id username' });

    res.json({ tournaments });
  });

  router.post('/', async (req, res) => {
    const {
      tournamentId,
      name,
      entry,
      rules,
    } = req.body;

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

    try {
      const newTournament = await TournamentModel.create({
        tournamentId,
        name,
        entry,
        rules,
        date: Date.now(),
      });

      const tournament = await TournamentModel.findOne({ _id: newTournament.id }).populate('rules.rule');
      list.push(tournament);
      io.emit('tournaments', { tournaments: list });

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
    const userId = req.decoded._id;

    const tournament = await TournamentModel.findOne({ _id: id }, 'users');
    let tournamentUsers = tournament.users;

    if (tournamentUsers.indexOf(userId) !== -1) {
      res.json({
        success: false,
        message: 'You already participate in this championship',
      });

      return;
    }

    tournamentUsers.push(userId);

    const newTournament = await TournamentModel
      .findOneAndUpdate({ _id: id }, { users: tournamentUsers }, { new: true })
      .populate({ path: 'users', select: '_id username' });

    const listTournamentIndex = _.findIndex(list, item => `${item._id}` === `${id}`);
    list[listTournamentIndex] = newTournament;
    io.emit('tournaments', { tournaments: list });

    res.json({
      success: true,
      tournament: newTournament,
    });
  });

  return router;
}

export default TournamentController;