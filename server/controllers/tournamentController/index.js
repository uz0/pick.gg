import express from 'express';

import get from './get';
import { validator as validateCreate, handler as create } from './create';
import { validator as validateAttend, handler as attend } from './attend';
import { validator as validateById, handler as getById } from './getById';
import { validator as validateEdit, handler as edit } from './edit';

import matchController from './match';

let router = express.Router();

const TournamentController = io => {
  router.get('/', get);

  router.get('/:id', validateById, getById);

  router.put('/:id', validateEdit, edit);

  router.patch('/:id/attend', validateAttend, attend);

  router.post('/', validateCreate, create);

  router.use('/:tournamentId/matches', matchController());

  return router;
};

export default TournamentController;
