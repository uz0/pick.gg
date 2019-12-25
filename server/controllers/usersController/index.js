import express from 'express';

import getAllUsers from './get';

import { validator as getUserProfileValidator, handler as getUserProfile } from './getUserProfile';

import { validator as userUpdateValidator, handler as updateUserHandler } from './updateUserProfile';

import { validator as getUserByIdValidator, handler as getUserByIdHandler } from './getUserById';

const router = express.Router();

const UsersController = () => {
  router.get('/me', getUserProfileValidator, getUserProfile);
  router.patch('/me', userUpdateValidator, updateUserHandler);

  router.get('/', getAllUsers);
  router.get('/:id', getUserByIdValidator, getUserByIdHandler);

  return router;
};

export default UsersController;
