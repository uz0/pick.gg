import RewardModel from '../../../models/reward';
import UserModel from '../../../models/user';

import { param } from 'express-validator/check';
import { isEntityExists } from '../../validators';

import { withValidationHandler } from '../../helpers';

const validator = [
  param('userId')
    .custom(value => isEntityExists(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const rewards = await RewardModel.find({ userId: req.params.userId });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
