import express from 'express';

import { validator as validateEdit, handler as edit } from './edit';
import { validator as validateDelete, handler as deleteHandler } from './delete';
import { validator as validateGet, handler as get } from './get';

const router = express.Router({
  mergeParams: true
});

const MatchController = () => {
  router.get('/', validateGet, get);

  router.patch('/', validateEdit, edit);

  router.delete('/:rewardId', validateDelete, deleteHandler);

  return router;
};

export default MatchController;
