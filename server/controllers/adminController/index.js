import express from 'express';

import getRewards from './reward/get';

import {validator as validateGetUserRewards, handler as getUserRewardsHandler} from './reward/getUserRewards';
import {validator as validateRewardCreate, handler as createRewardHandler} from './reward/create';
import {validator as validateRewardUpdate, handler as updateRewardHandler} from './reward/update';
import {validator as validateRewardDelete, handler as deleteRewardHandler} from './reward/delete';

import getUsers from './user/get';
import getUserByName from './user/getUserByName';
import {validator as validateUserId, handler as getUserById} from './user/getUserById';
import {validator as validateUserCreate, handler as createUserHandler} from './user/create';
import {validator as validateUserDelete, handler as deleteUserHandler} from './user/delete';
import {validator as validateUserUpdate, handler as updateUserHandler} from './user/update';

let router = express.Router();

const AdminController = () => {
  router.get('/reward', getRewards);

  router.get('/reward/user/:userId', validateGetUserRewards, getUserRewardsHandler);

  router.post('/reward', validateRewardCreate, createRewardHandler);

  router.patch('/reward/:id', validateRewardUpdate, updateRewardHandler);

  router.delete('/reward/:id', validateRewardDelete, deleteRewardHandler);

  router.post('/user', validateUserCreate, createUserHandler);

  router.get('/user', getUsers);

  router.get('/user/:id', validateUserId, getUserById);

  router.get('/user/name/:username', getUserByName);

  router.delete('/user/:id', validateUserDelete, deleteUserHandler);

  router.patch('/user/:id', validateUserUpdate, updateUserHandler);

  return router;
};

export default AdminController;