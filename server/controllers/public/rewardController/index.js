import express from 'express';

import getUserRewards from './getUserRewards';

const router = express.Router();

const RewardController = () => {
  router.get('/reward', getUserRewards);

  return router;
};

export default RewardController;
