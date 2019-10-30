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

app.get('/tournaments/:id', (req, res) => {
  const { id } = req.params
  const filePath = path.join(process.cwd(), 'client', 'build', 'index.html');

  const insertToHead = (str, data) => {
    const [start, end] = str.split('<head>')
    return start + '<head>' + data + end
  } 

  async function getTournament(id) {
    const tournament = 'tournament'
    return tournament
  }

  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
   
    const tournament = getTournament(id)
    const str =
    `<meta name="description" content="${tournament.description}" />` + 
    `<meta property="og:title" content="${tournament.name}" />` + 
    `<meta property="og:description" content="${tournament.description}" />` +
    `<meta property="og:image" content="${tournament.imageUrl}" />`
    
    const result = insertToHead(data, str)

    res.send(result);
  });
});

// express will serve up index.html if it doesn't recognize the route
app.get('/*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));