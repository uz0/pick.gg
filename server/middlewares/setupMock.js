import express from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';

const router = express.Router();

const ONE_DAY = 60 * 60 * 24;

const setupMock = (app) => {
  UserModel.findOne({ username: 'test1' }).then(checkUser => {
    if (!checkUser) {
      UserModel.create({
        username: 'test1',
        imageUrl: '',
        email: 'test1@email.dm',
        summonerName: 'test1'
      });

      UserModel.create({
        username: 'test2',
        imageUrl: '',
        email: 'test2@email.dm',
        summonerName: 'test2'
      });

      UserModel.create({
        username: 'admin1',
        imageUrl: '',
        email: 'admin1@email.dm',
        summonerName: 'admin1',
        isAdmin: true
      });

      UserModel.create({
        username: 'streamer1',
        imageUrl: '',
        email: 'streamer1@email.dm',
        summonerName: 'streamer1',
        canProvideTournaments: true
      });
    }
  });

  router.use(async (req, res, next) => {
    const username = req.headers['x-mocked-username'];
    const user = await UserModel.findOne({ username });

    if (!user) {
      next();
      return;
    }

    const { _id, isAdmin } = user;

    req.__mockedToken = jwt.sign({
      _id,
      username,
      isAdmin
    }, app.get('superSecret'), {
      expiresIn: ONE_DAY
    });

    next();
  });

  return router;
};

export default setupMock;
