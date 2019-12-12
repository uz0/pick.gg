import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check, validationResult } from 'express-validator/check';

import TournamentModel from '../../models/tournament';
import { GAMES } from '../../../common/constants'

const validator = [
  check('game')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter game')
    .isIn(GAMES)
    .withMessage('Choose valid game name'),
  check('name')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter name'),
  check('price')
    .not()
    .isEmpty()
    .withMessage('Enter entry price'),
  check('startAt')
    .not()
    .isEmpty()
    .withMessage('Choose start date')
];

const withValidationHandler = handler => (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return handler(req, res);
};

const handler = withValidationHandler(async (req, res) => {
  try {
    const newTournament = await TournamentModel.create(
      defaults(
        pick(req.body, [
          'game',
          'name',
          'description',
          'startAt',
          'price',
          'url',
          'imageUrl',
        ]),
        {
          isReady: false,
          url: '',
          description: '',
          imageUrl: '',
          summoners: [],
          moderators: [],
          rewards: [],
          rules: '',
          createdAt: Date.now(),
          creator: req.decoded._id
        }
      )
    );

    res.status(200).json({
      newTournament
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
