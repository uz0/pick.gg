import express from 'express';

import getRewards from './reward/get';
import {validator as validateCreate, handler as createHandler} from './reward/create';
import {validator as validateUpdate, handler as updateHandler} from './reward/update';
import {validator as validateDelete, handler as deleteHandler} from './reward/delete';

let router = express.Router();

const AdminController = () => {
  router.get('/reward', getRewards);

  router.post('/reward', validateCreate, createHandler);
  
  router.patch('/reward/:id', validateUpdate, updateHandler);
  
  router.delete('/reward/:id', validateDelete, deleteHandler);

  return router;
};

export default AdminController;