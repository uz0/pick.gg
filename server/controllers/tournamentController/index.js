import express from 'express';

import get from './get';
import * as create from './create';
import * as attend from './attend';
import * as view from './view';
import * as editRewards from './rewards/edit';
import * as getRewards from './rewards/get';
import * as getById from './getById';
import * as edit from './edit';
import * as ready from './ready';
import * as applicantStatus from './applicantStatus'

import matchController from './match';

let router = express.Router();

const TournamentController = io => {
  router.get('/', get);

  router.get('/:id', getById.validator, getById.handler);

  router.get('/:id/rewards', getRewards.validator, getRewards.handler);

  router.patch('/:id', edit.validator, edit.handler);

  router.patch('/:id/ready', ready.validator, ready.handler)

  router.patch('/:id/attend', attend.validator, attend.handler);

  router.patch('/:id/view', view.validator, view.handler);

  router.patch('/:id/rewards', editRewards.validator, editRewards.handler);

  router.post('/', create.validator, create.handler);

  router.use('/:tournamentId/matches', matchController());

  return router;
};

export default TournamentController;
