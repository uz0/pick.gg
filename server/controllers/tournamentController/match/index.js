import express from 'express';

import {validator as validateCreate, handler as create} from './create'

const router = express.Router({
    mergeParams: true
});

const MatchController = () => {

  router.post('/', validateCreate, create);

  return router;
}

export default MatchController;