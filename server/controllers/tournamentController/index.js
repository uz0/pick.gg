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
 *     description: Get tournament
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Tournament object
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Tournament'
 *     responses:
 *       200:
 *         description: get tournaments
 */

  router.get('/', get);

  /**
 * @swagger
 *
 * /api/tournaments:
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

  router.post('/', create.validator, create.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}:
 *   get:
 *     tags:
 *     - API(Tournaments)
 *     summary: Get tournament by id
 *     description: Get tournament by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tournament
 *         description: Tournament object
 *         in:  body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Get tournament by id
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
 *     responses:
 *       200:
 *         description: tournaments
 */

  router.get('/game/:game', getByGame.validator, getByGame.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/rewards:
 *   get:
 *     tags:
 *     - API(Tournaments)
 *     summary: Get tournament rewards
 *     description: Get tournament rewards
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get tournament rewards
 */

  router.get('/:id/rewards', getRewards.validator, getRewards.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Edit tournament
 *     description: Edit tournament
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Edited tournament
 */

  router.patch('/:id', edit.validator, edit.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/attend:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Attend a tournament
 *     summary: Attend a tournament
 *     description: Tournament attend
 *     responses:
 *       200:
 *         description: Attended a tournament
 */

  router.patch('/:id/attend', attend.validator, attend.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/applicantStatus:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Update applicant status
 *     description: Update applicant status
 *     responses:
 *       200:
 *         description: tournaments
 */

  router.patch('/:id/applicantStatus', applicantStatus.validator, applicantStatus.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/forecastStatus:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Update forecast status
 *     description: Update applicant status
 *     responses:
 *       200:
 *         description: tournaments
 */

  router.patch('/:id/forecastStatus', forecastStatus.validator, forecastStatus.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/view:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Update view
 *     description: Update view
 *     responses:
 *       200:
 *         description: Updated view
 */

  router.patch('/:id/view', view.validator, view.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/start:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: Start tournament
 *     description: Start tournament
 *     responses:
 *       200:
 *         description: Started tournament
 */

  router.patch('/:id/start', start.validator, start.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/finalize:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: finalize tournament
 *     description: finalize tournament
 *     responses:
 *       200:
 *         description: finalized tournament
 */

  router.patch('/:id/finalize', finalize.validator, finalize.handler);

  /**
 * @swagger
 *
 * /api/tournaments/{id}/rewards:
 *   patch:
 *     tags:
 *     - API(Tournaments)
 *     summary: edit rewards tournament
 *     description: edit rewards tournament
 *     responses:
 *       200:
 *         description: edited rewards of tournament
 */

  router.patch('/:id/rewards', editRewards.validator, editRewards.handler);

  router.use('/:tournamentId/matches', matchController());

  return router;
};

export default TournamentController;
