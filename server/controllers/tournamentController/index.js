import express from 'express';

import TournamentModel from '../../models/tournament';
import FantasyTournament from '../../models/fantasy-tournament';
import UserModel from '../../models/user';

import moment from 'moment';

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import get from './get'
import {validator as validateCreate, handler as create} from './create'
import {validator as validateAttend, handler as attend} from './attend'

let router = express.Router();

const TournamentController = io => {
  router.get('/', get);

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

  router.get('/my', async (req, res) => {
    if(isEmpty(req.decoded)){
      res.send({
        tournaments: null,
      })

      return;
    }

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
    const { id } = req.params;

    const tournament = await FantasyTournament
      .findOne({ _id: id })
      .populate({ path: 'users.players', select: '_id id name photo' })
      .populate({ path: 'users.user', select: '_id username isStreamer' })
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

  router.patch('/:id/attend',validateAttend,attend)

  router.post('/', validateCreate, create);

  router.post('/:id/setup', async (req, res) => {
    const id = req.params.id;
    const players = req.body.players;
    const userId = req.decoded._id;

    const tournament = await FantasyTournament.findOne({ _id: id });
    const user = await UserModel.findOne({ _id: userId });

    if (tournament.started) {
      res.json({
        success: false,
        message: 'The tournament is already started',
      });

      return;
    }

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
      players,
      user: userId,
    });

    const newTournament = await FantasyTournament
      .findOneAndUpdate({ _id: id }, { users: tournamentUsers }, { new: true })
      .populate({ path: 'users.user', select: '_id username' })
      .populate({ path: 'users.players' })

    io.emit('tournamentParticipantsUpdate', { user });

    res.json({
      success: true,
      tournament: newTournament,
    });
  });

  return router;
}

export default TournamentController;