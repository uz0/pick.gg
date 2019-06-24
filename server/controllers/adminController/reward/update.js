import pick from 'lodash/pick';
import difference from 'lodash/difference';

import { withValidationHandler } from '../../helpers';
import { check, validationResult } from 'express-validator/check';

import RewardModel from '../../../models/reward';

const rewardPropsValidator = (value, { req }) => {
  const requestFields = Object.keys(req.body);
  const rewardModelFields = ['key', 'isClaimed', 'description', 'image'];
  
  const diff = difference(requestFields, rewardModelFields);

  if(diff.length){
    throw new Error(`Reward shouldn't contain ${diff.join(', ')} fields`);
  }

  return true;
}

const validator = [
  check('body')
    .custom(rewardPropsValidator)
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const reward = await RewardModel.findOneAndUpdate({ _id: req.params.id },
      pick(req.body, [
        'key',
        'isClaimed',
        'description',
        'image',
      ]),
      {new: true},
    );

    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };