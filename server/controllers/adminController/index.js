import express from 'express';

import getRewards from './reward/get';

let router = express.Router();

const AdminController = () => {
  router.get('/reward', getRewards);

  return router;
};

export default AdminController;