import express from 'express';

import get from './get';
import * as create from './create';
import * as attend from './attend';
import * as view from './view';
import * as getById from './getById';
import * as edit from './edit';
import * as forecastStatus from './forecastStatus';
import * as start from './start';
import * as finalize from './finalize';
import * as applicantStatus from './applicantStatus';

import matchController from './match';
import rewardController from './rewards'

let router = express.Router();

const TournamentController = io => {
  router.get('/', get);

  router.post('/', create.validator, create.handler);

  router.get('/:id', getById.validator, getById.handler);

  router.patch('/:id', edit.validator, edit.handler);

  router.patch('/:id/attend', attend.validator, attend.handler);

  router.patch('/:id/applicantStatus', applicantStatus.validator, applicantStatus.handler);

  router.patch('/:id/forecastStatus', forecastStatus.validator, forecastStatus.handler);

  router.patch('/:id/view', view.validator, view.handler);

  router.patch('/:id/start', start.validator, start.handler);

  router.patch('/:id/finalize', finalize.validator, finalize.handler);

  router.use('/:tournamentId/matches', matchController());

  router.use('/:tournamentId/rewards', rewardController());

  return router;
};

export default TournamentController;
