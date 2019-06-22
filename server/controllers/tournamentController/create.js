import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check, validationResult } from 'express-validator/check';

import TournamentModel from '../../models/tournament';

const validator = [
  check('name')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter name'),
  check('price')
    .not()
    .isEmpty()
    .withMessage('Enter entry price'),
  check('rules')
    .not()
    .isEmpty()
    .withMessage('Provide rules'),
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
          'id',
          'name',
          'description',
          'url',
          'imageUrl',
          'startAt',
          'rewards',
          'price',
          'rules',
          'creatorId',
          'summoners',
        ]),
        {
          isReady: false,
          url: '',
          description: '',
          imageUrl: '',
          summoners: [],
          rewards: [],
          createdAt: Date.now(),
          creatorId: req.decoded._id
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
