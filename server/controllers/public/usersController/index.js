import express from 'express';

import get from './get';
import * as getById from './getById';

let router = express.Router();

const PublicUserController = () => {
  router.get('/', get);

  router.get('/:id', getById.validator, getById.handler);

  return router;
};

export default PublicUserController;
