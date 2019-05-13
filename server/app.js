import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from 'morgan';
import bodyParser from 'body-parser';

import {
  UsersController,
  AuthenticationController,
  TournamentController,
  TransactionController,
  SystemController,
  AdminController,
  StreamerController,
} from './controllers';

import {
  PublicRulesController,
  PublicUsersController,
  PublicPlayersController,
  PublicTournamentController,
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

app.use('/public/rules', PublicRulesController());
app.use('/public/players', PublicPlayersController());
app.use('/public/users', PublicUsersController());
app.use('/public/tournaments', PublicTournamentsController());

app.use('/api/authentication', AuthenticationController(app));

app.use('/api', AuthVerifyMiddleware(app));
app.use('/api/users', UsersController());
app.use('/api/tournaments', TournamentController(io));
app.use('/api/transactions', TransactionController());
app.use('/api/system', SystemController());

app.use('/api/admin', AdminVerifyMiddleware, AdminController(io));
app.use('/api/streamer', StreamerVerifyMiddleware, StreamerController(io));

// express will serve up index.html if it doesn't recognize the route
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));