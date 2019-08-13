import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check, body } from 'express-validator/check';

import { withValidationHandler } from '../../helpers';

import RewardModel from '../../../models/reward';

const validator = [
  check('key')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter key'),
  body()
    .custom(async (value, { req }) => {
      const { key } = value;

      const reward = await RewardModel.findOne({ key }).lean();

      if(!isEmpty(reward)){
        throw new Error(`Reward with key ${key} is already exists`);;
      }

      return true;
    })
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const reward = await RewardModel.create(
      defaults(
        pick(req.body, [
          'key',
          'description',
          'userId',
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