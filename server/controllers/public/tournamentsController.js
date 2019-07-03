import express from "express";
import TournamentModel from "../../models/tournament";

let router = express.Router();

const PublicTournamentsController = io => {
  router.get('/', async (req, res) => {
    const tournaments = await TournamentModel
      .find({})
      .populate('tournament', 'name date')
      .populate({ path: 'users.players', select: 'id name' })
      .populate({ path: 'users.user', select: '_id username' })
      .sort({date: -1})

    res.json({ tournaments });
  });

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
    const tournaments = await TournamentModel.find({})
      .populate('tournament', 'name date')
      .populate({ path: 'users.players', select: 'id name' })
      .populate({ path: 'users.user', select: '_id username' })
      .sort({date: -1})

    res.send({
      tournaments,
    })

  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const tournament = await TournamentModel
      .findOne({ _id: id })
      .populate({ path: 'users.players', select: '_id id name photo' })
      .populate({ path: 'users.user', select: '_id username' })
      .populate('rules.rule')
      .populate({ path: 'winner', select: 'id username' })
      .populate({ path: 'creator', select: 'id username isStreamer' })
      .populate('tournament')
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
      });

    res.json({ tournament });
  });

  router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const tournaments = await TournamentModel.find({'users.user': id}, '-rules -users.players')

    res.json({ tournaments });
  });

  return router;
}

export default PublicTournamentsController;