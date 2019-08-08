import express from 'express';

import get from './get';
import getUserTournaments from './getUserTournaments';
import * as getById from './getById';
import * as getRewards from './rewards/get';

let router = express.Router();

const PublicTournamentController = () => {
  router.get('/user/:userId', getUserTournaments);

  router.get('/', get);

  router.get('/:id', getById.validator, getById.handler);

  router.get('/:id/rewards', getRewards.validator, getRewards.handler);

  return router;
};

export default PublicTournamentController;
