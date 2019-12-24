import express from 'express';

import getUserRewards from './getUserRewards';
import getStreamerRewards from './getStreamerRewards';

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   Reward:
 *     type: object
 *     properties:
 *       key:
 *         type: string
 *       isClaimed:
 *         type: boolean
 *       description:
 *         type: string
 *       image:
 *         type: string
 */

const RewardController = () => {
  /**
 * @swagger
 *
 * /api/reward:
 *   get:
 *     tags:
 *     - "API(Reward)"
 *     summary: "Get reward"
 *     description: getUserRewards
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Get reward object"
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Reward'
 *     responses:
 *       200:
 *         description: A reward object.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Reward'
 */

  router.get('/reward', getUserRewards);

  /**
 * @swagger
 *
 * /api/reward/streamer:
 *   get:
 *     tags:
 *     - "API(Reward)"
 *     summary: "Get reward streamer"
 *     description: getStreamerRewards
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Get reward object"
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Reward'
 *     responses:
 *       200:
 *         description: A reward object.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Reward'
 */

  router.get('/reward/streamer', getStreamerRewards);

  return router;
};

export default RewardController;
