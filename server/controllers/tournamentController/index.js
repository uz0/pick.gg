import express from 'express';

import TournamentModel from '../../models/tournament';
import UserModel from '../../models/user';

import moment from 'moment';

import get from './get'
import {validator as validateCreate, handler as create} from './create'
import {validator as validateAttend, handler as attend} from './attend'
import {validator as validateById, handler as getById} from './getById';

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

  router.get('/:id',validateById, getById);

  router.patch('/:id/attend',validateAttend, attend)

  router.post('/', validateCreate, create);

  return router;
}

export default TournamentController;