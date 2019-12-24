import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import socketIO from 'socket.io';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cheerio from 'cheerio';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import {
  UsersController,
  TournamentController,
  AdminController,
  RewardController
} from './controllers';

import AuthenticationController from './controllers/authenticationController';

import {
  PublicUsersController,
  PublicTournamentController,
  PublicRatingController
} from './controllers/public';

import {
  AuthVerifyMiddleware,
  AdminVerifyMiddleware,
  setupMock
} from './middlewares';
import config from './config';

import TournamentModel from './models/tournament';

const app = express();
const server = http.Server(app);
server.timeout = 999999;
const io = socketIO(server);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      description: '',
      title: 'PICK.GG',
      version: '1.0.0'
    }
  },
  customCss: '.swagger-ui .topbar { display: none }',
  apis: [
    './controllers/usersController/index.js',
    './controllers/tournamentController/index.js',
    './controllers/rewardController/index.js'
  ],
  tags: ['API(Users)'],
  defaultschemes: ['https', 'http']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

mongoose.Promise = Promise;
mongoose.connect(config.database, config.options);

app.set('superSecret', config.secret);

const port = process.env.PORT || 3001;

if (process.argv[2] === '--mocked' || process.env.MOCK_USER) {
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

app.use('/home', (req, res, next) => {
  const lang = req.hostname.includes('ru.pick.gg') ? 'ru' : 'en';

  const description = {
    ru: 'Сервис для проведения турниров по лиге легенд между стримерами',
    en:
      'Service for holding tournaments in a League of Legends between streamers'
  };

  req.meta = [];

  req.title = 'Pick.gg';

  req.meta.push(`<meta name="description" content="${description[lang]}" />`);
  req.meta.push('<meta property="og:title" content="Pick.gg" />');
  req.meta.push(
    `<meta property="og:description" content="${description[lang]}" />`
  );

  req.meta.push('<meta property="og:image" content="url" />');
  req.meta.push('<meta property="og:image:type" content="image/png">');
  req.meta.push('<meta property="og:image:width" content="320">');
  req.meta.push('<meta property="og:image:height" content="240">');

  next();
});

app.use('/tournaments/:id', async (req, res, next) => {
  const { id } = req.params;
  req.meta = [];

  try {
    const tournament = await TournamentModel.findById(id)
      .populate('winner')
      .populate('creatorId')
      .populate('applicants')
      .populate('matches')
      .populate('creator', '_id username summonerName')
      .exec();

    req.title = tournament.name;

    req.meta.push(
      `<meta name="description" content="${tournament.description}" />`
    );
    req.meta.push(`<meta property="og:title" content="${tournament.name}" />`);
    req.meta.push(
      `<meta property="og:description" content="${tournament.description}" />`
    );
    req.meta.push(
      `<meta property="og:image" content="${tournament.imageUrl}" />`
    );
    req.meta.push('<meta property="og:image:type" content="image/png">');
    req.meta.push('<meta property="og:image:width" content="320">');
    req.meta.push('<meta property="og:image:height" content="240">');
  } catch (error) {
    res.json({ error });
  }

  next();
});

app.get('/*', (req, res) => {
  const filepath = path.join(process.cwd(), 'client', 'build', 'index.html');
  const $ = cheerio.load(fs.readFileSync(filepath));

  if (req.title) {
    $('head')
      .find('title')
      .replaceWith(`<title>${req.title}</title>`);
  }

  if (req.meta) {
    const meta = req.meta.join('');
    $('head').append(meta);
  }

  res.send($.html());
});

server.listen(port, () => console.log(`Listening on port ${port}`));
