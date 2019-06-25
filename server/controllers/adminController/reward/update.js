import RewardModel from '../../../models/reward';

import pick from 'lodash/pick';

import { body } from 'express-validator/check';
import { isRequestHasCorrectFields } from '../../validators';

import { withValidationHandler } from '../../helpers';

const validator = [
  body()
    .custom(value => isRequestHasCorrectFields(value, RewardModel))
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