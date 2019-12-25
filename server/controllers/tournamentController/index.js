import express from 'express';

import get from './get';
import * as create from './create';
import * as attend from './attend';
import * as view from './view';
import * as editRewards from './rewards/edit';
import * as getRewards from './rewards/get';
import * as getById from './getById';
import * as getByGame from './getByGame';
import * as edit from './edit';
import * as forecastStatus from './forecastStatus';
import * as start from './start';
import * as finalize from './finalize';
import * as applicantStatus from './applicantStatus';

import matchController from './match';

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   Tournament:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       url:
 *         type: string
 *       imageUrl:
 *         type: string
 *       createdAt:
 *         type: date
 *       rewards:
 *         type: object
 *         items:
 *           $ref: '#/definitions/Reward'
 *       rules:
 *         type: string
 *       isForecastingActive:
 *         type: boolean
 *         default: false
 *       isStarted:
 *         type: boolean
 *         default: false
 *       isFinalized:
 *         type: boolean
 *         default: false
 *       winners:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             _id:
 *               type: boolean
 *             id:
 *               $ref: '#/definitions/User'
 *             position:
 *               type: string
 *               enum:
 *                 - summoner
 *                 - viewer
 *       creator:
 *         $ref: '#/definitions/User'
 *       summoners:
 *         type: array
 *         $ref: '#/definitions/User'
 *       moderators:
 *         type: array
 *         $ref: '#/definitions/User'
 *       applicants:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/definitions/User'
 *             status:
 *               type: string
 *               enum:
 *                 - PENDING
 *                 - REJECTED
 *                 - ACCEPTED
 *               default: PENDING
 *       game:
 *         type: string
 *         default: ''
 *       viewers:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             summoners:
 *               type: string
 */

const TournamentController = io => {
/**
 * @swagger
 *
 * /api/tournaments:
 *   get:
 *     tags:
 *     - "API(Tournaments)"
 *     summary: Get a tournament
 *     description: Get tournament
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tournament
 *         description: Tournament object
 *         in: query
 *         required: true
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Tournament'
 *     responses:
 *       200:
 *         description: get tournaments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Tournament'
 *   post:
 *     tags:
 *     - API(Tournaments)
 *     summary: Create tournament
 *     description: Create tournament
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: Get reward object
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Tournament'
 *     responses:
 *       200:
 *         description: Created tournament
 */

  router.get('/', get);

  router.post('/', create.validator, create.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}:
 *   get:
 *     tags:
 *     - API(Tournaments)
 *     summary: Get tournament by id
 *     description: Get tournament by id
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: "tournamentId"
 *       in: "path"
 *       schema:
 *         type: object
 *         $ref: "#/definitions/Tournament"
 *     responses:
 *       200:
 *         description: Get tournament by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Tournament'
 */

  router.get('/:id', getById.validator, getById.handler);

  /**
 * @swagger
 *
 * /api/tournaments/game/{game}:
 *   get:
 *     tags:
 *     - API(Tournaments)
 *     summary: Get tournament game
 *     description: Get tournament game
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: "game"
 *       in: "query"
 *     responses:
 *       200:
 *         description: tournaments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Tournament'
 */

  router.get('/game/:game', getByGame.validator, getByGame.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/rewards:
 *   get:
 *     tags:
 *     - API(Tournaments)
 *     summary: Get tournament rewards
 *     description: Get tournament rewards
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: "tournamentId"
 *       in: "query"
 *     responses:
 *       200:
 *         description: Get tournament rewards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Reward'
 */

  router.get('/:id/rewards', getRewards.validator, getRewards.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Edit tournament
 *     description: Edit tournament
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           description:
 *             type: string
 *           imageUrl:
 *             type: string
 *           url:
 *             type: string
 *           rules:
 *             type: string
 *           summoners:
 *             type: array
 *             $ref: '#/definitions/User'
 *           moderators:
 *             type: array
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Edited tournament
 */

  router.patch('/:id', edit.validator, edit.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/attend:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Attend a tournament
 *     description: Tournament attend
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           user:
 *             type: string
 *     responses:
 *       200:
 *         description: Attended a tournament
 */

  router.patch('/:id/attend', attend.validator, attend.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/applicantStatus:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Update applicant status
 *     description: Update applicant status
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           userId:
 *             type: string
 *           newStatus:
 *             type: string
 *     responses:
 *       200:
 *         description: tournaments
 */

  router.patch('/:id/applicantStatus', applicantStatus.validator, applicantStatus.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/forecastStatus:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Update forecast status
 *     description: Update applicant status
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           isForecastingActive:
 *             type: boolean
 *     responses:
 *       200:
 *         description: tournaments
 */

  router.patch('/:id/forecastStatus', forecastStatus.validator, forecastStatus.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/view:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Update view
 *     description: Update view
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           summoners:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated view
 */

  router.patch('/:id/view', view.validator, view.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/start:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Start tournament
 *     description: Start tournament
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           isStarted:
 *             type: boolean
 *             default: true
 *           isForecastingActive:
 *             type: boolean
 *             default: false
 *     responses:
 *       200:
 *         description: Started tournament
 */

  router.patch('/:id/start', start.validator, start.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/finalize:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: finalize tournament
 *     description: finalize tournament
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: object
 *         properties:
 *           summoners:
 *             type: object
 *     responses:
 *       200:
 *         description: finalized tournament
 */

  router.patch('/:id/finalize', finalize.validator, finalize.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{tournamentId}/rewards:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: edit rewards tournament
 *     description: edit rewards tournament
 *     parameters:
 *     - in: "body"
 *       name: "tournamentId"
 *       schema:
 *         type: array
 *         properties:
 *           type: object
 *           $ref: '#/definitions/Reward'
 *     responses:
 *       200:
 *         description: edited rewards of tournament
 */

  router.patch('/:id/rewards', editRewards.validator, editRewards.handler);

  router.use('/:tournamentId/matches', matchController());

  return router;
};

export default TournamentController;
