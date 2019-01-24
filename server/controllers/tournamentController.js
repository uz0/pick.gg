import express from "express";
import TournamentModel from "../models/tournament";

let router = express.Router();

const TournamentController = () => {
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
      const tournament = await TournamentModel.create({
        tournamentId,
        name,
        entry,
        rules,
        date: Date.now(),
      });

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

    res.json({
      success: true,
      tournament: newTournament,
    });
  });

  return router;
}

export default TournamentController;