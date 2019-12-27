import express from 'express';
import * as create from './create';
import * as choose from './choose';
import * as edit from './edit';
import * as random from './random';
import * as deleteController from './delete';

const router = express.Router({
  mergeParams: true
});

const TeamsController = () => {
  router.post('/', create.validator, create.handler);
  router.patch('/random', random.validator, random.handler);
  router.patch('/:teamId', edit.validator, edit.handler);
  router.patch('/:teamId/choose', choose.validator, choose.handler);
  router.delete('/:teamId', deleteController.validator, deleteController.handler);

  return router;
};

export default TeamsController;