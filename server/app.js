import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import socketIO from 'socket.io';
import logger from 'morgan';
import bodyParser from 'body-parser';

import {
  UsersController,
  TournamentController,
  AdminController,
  StreamerController,
  RewardController,
} from './controllers';

import AuthenticationController from './controllers/authenticationController';

import {
  PublicUsersController,
  PublicPlayersController,
  PublicTournamentsController,
} from './controllers/public';

import { AuthVerifyMiddleware, AdminVerifyMiddleware, StreamerVerifyMiddleware } from './middlewares';
import config from './config';

const app = express();
let server = http.Server(app);
server.timeout = 999999;
let io = socketIO(server);

mongoose.Promise = Promise;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') console.log('PRODUCTION');
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/authentication', AuthenticationController(app));

app.use('/public/players', PublicPlayersController());
app.use('/public/users', PublicUsersController());
app.use('/public/tournaments', PublicTournamentsController());

app.use('/api', AuthVerifyMiddleware(app));
app.use('/api/users', UsersController());
app.use('/api/tournaments', TournamentController(io));
app.use('/api/rewards', RewardController());

app.use('/api/admin', AdminVerifyMiddleware, AdminController(io));
app.use('/api/streamer', StreamerVerifyMiddleware, StreamerController(io));

// express will serve up index.html if it doesn't recognize the route
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));