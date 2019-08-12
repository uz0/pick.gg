import express from 'express';

import getUserRewards from './getUserRewards';
import getStreamerRewards from './getStreamerRewards';

let router = express.Router();

const RewardController = () => {
  router.get('/reward', getUserRewards);

  router.get('/reward/streamer', getStreamerRewards);

  return router;
};

export default RewardController;