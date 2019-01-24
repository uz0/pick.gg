import express from "express";
import TournamentModel from "../models/tournament";

let router = express.Router();

const TournamentController = () => {
  router.get('/', async (req, res) => {
    const tournaments = await TournamentModel.find().populate('rules.rule');
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

  return router;
}

export default TournamentController;