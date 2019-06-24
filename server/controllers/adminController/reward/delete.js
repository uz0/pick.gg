import RewardModel from '../../../models/reward';
import { withValidationHandler } from '../../helpers';

import { check, validationResult } from 'express-validator/check';

const rewardExistenceValidator = async (value, { req }) => {
  const reward = await RewardModel.findById(req.params.id);

  if(!reward){
    throw new Error(`Reward with such id doesn't exist`);
  }

  return true;
}

const validator = [
  check('body')
    .custom(rewardExistenceValidator)
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