import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import socketIO from 'socket.io';
import logger from 'morgan';
import bodyParser from 'body-parser';
import fs from 'fs'

import {
  UsersController,
  TournamentController,
  AdminController,
  RewardController,
} from './controllers';

import AuthenticationController from './controllers/authenticationController';

import {
  PublicUsersController,
  PublicTournamentController,
  PublicRatingController,
} from './controllers/public';

import { getHomePageIndexFile, getTournamentIndexFile } from './controllers/metaTagController'

import { AuthVerifyMiddleware, AdminVerifyMiddleware, setupMock } from './middlewares';
import config from './config';

const app = express();
let server = http.Server(app);
server.timeout = 999999;
let io = socketIO(server);

mongoose.Promise = Promise;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

const port = process.env.PORT || 3001;

if (process.argv[2] === '--mocked') {
  console.log('MOCKED MODE ENABLED');
  app.use(setupMock(app));
}

if (process.env.NODE_ENV === 'production') console.log('PRODUCTION');
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), 'client', 'build')));

app.use('/authentication', AuthenticationController(app));

app.use('/public/users', PublicUsersController());
app.use('/public/rating', PublicRatingController());
app.use('/public/tournaments', PublicTournamentController());

app.use('/api', AuthVerifyMiddleware(app));
app.use('/api/users', UsersController());
app.use('/api/tournaments', TournamentController(io));
app.use('/api/rewards', RewardController());

app.use('/api/admin', AdminVerifyMiddleware, AdminController(io));

app.get('/home', getHomePageIndexFile)

app.get('/tournaments/:id', getTournamentIndexFile)

// express will serve up index.html if it doesn't recognize the route
app.get('/*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));