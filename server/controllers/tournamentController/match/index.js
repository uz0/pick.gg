import express from 'express';

import get from './get'
import {validator as validateCreate, handler as create} from './create'
import {validator as validateAttend, handler as attend} from './attend'
import {validator as validateById, handler as getById} from './getById';

import matchController from './match'

let router = express.Router({
    mergeParams: true
});

const MatchController = () => {
  router.get('/', get);

  router.get('/:id',validateById, getById);

  router.patch('/:id/attend',validateAttend, attend)

  router.post('/', validateCreate, create);

  router.use('/:tournamentId/mathes',matchController)

  return router;
}

export default MatchController;