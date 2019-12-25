import express from 'express';

import getAllUsers from './get';

import { validator as getUserProfileValidator, handler as getUserProfile } from './getUserProfile';

import { validator as userUpdateValidator, handler as updateUserHandler } from './updateUserProfile';

import { validator as getUserByIdValidator, handler as getUserByIdHandler } from './getUserById';

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - email
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       imageUrl:
 *         type: string
 *       about:
 *         type: string
 *       isAdmin:
 *         type: boolean
 *       isVerified:
 *         type: boolean
 *       canProvideTournaments:
 *         type: boolean
 *       twitchAccount:
 *         type: string
 *       gameSpecificName:
 *         type: object
 *       contact:
 *         type: string
 *       regionId:
 *         type: string
 *       preferredPosition:
 *         type: string
 *         enum:
 *         - ""
 *         - "adc"
 *         - "mid"
 *         - "top"
 *         - "jungle"
 *         - "support"
 */

const UsersController = () => {
/**
 * @swagger
 *
 * /api/users/me:
 *   get:
 *     tags:
 *     - "API(Users)"
 *     summary: "Get user"
 *     description: getUserProfile
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *      - name: user
 *        description: get user
 *        in: "query"
 *     responses:
 *       200:
 *         description: A user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *   patch:
 *     tags:
 *     - API(Users)
 *     summary: Update user profile
 *     description: userUpdateProfile
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: user
 *        description: User object
 *        in:  body
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: A user object.
 *         parameters:
 *         - name: user
 *           description: User object
 *           in:  body
 *           required: true
 *           type: string
 *         schema:
 *          $ref: '#/definitions/User'
 */

  router.get('/me', getUserProfileValidator, getUserProfile);
  router.patch('/me', userUpdateValidator, updateUserHandler);

  /**
 * @swagger
 *
 * /api/users:
 *   get:
 *     tags:
 *     - API(Users)
 *     summary: Get all users
 *     description: getAllUsers
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: allUsers
 *        description: Users
 *        in: "query"
 *        required: true
 *        type: array
 *        items:
 *          type: object
 *          $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: A user array.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */

  router.get('/', getAllUsers);

  /**
 * @swagger
 *
 * /api/users/{userId}:
 *   get:
 *     tags:
 *     - API(Users)
 *     summary: User by ID
 *     description: get user by ID
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: userId
 *        description: User by ID
 *        in: "path"
 *        required: true
 *     responses:
 *       200:
 *         description: A user object by ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 */

  router.get('/:id', getUserByIdValidator, getUserByIdHandler);

  return router;
};

export default UsersController;
