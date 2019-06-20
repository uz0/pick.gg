import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check, validationResult } from 'express-validator/check';

import RewardModel from '../../../models/reward';

const validator = [
  check('key')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter key'),
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
    const reward = await RewardModel.create(
      defaults(
        pick(req.body, [
          'key',
          'description',
          'image',
        ]),
        {
          key: '',
          isClaimed: false,
          description: '',
          image: '',
        }
      )
    );

    res.status(200).json({
      reward
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };