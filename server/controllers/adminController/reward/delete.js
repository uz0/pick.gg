import RewardModel from '../../../models/reward';
import { withValidationHandler } from '../../helpers';

import { isEntityExists } from '../../validators';

import { param } from 'express-validator/check';

const validator = [
  param('id')
    .custom(value => isEntityExists(value, RewardModel))
];

const handler = withValidationHandler(async (req, res) => {
  try {
    await RewardModel
      .remove({ _id: req.params.id });
    res.json({});
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };