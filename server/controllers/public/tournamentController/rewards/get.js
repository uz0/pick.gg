import isEmpty from 'lodash/isEmpty';
import Tournament from '../../../../models/tournament';
import Reward from '../../../../models/reward';

import { param, body } from 'express-validator/check';

import {
  isEntityExists
} from '../../../validators';

import { withValidationHandler } from '../../../helpers';

const validator = [
  param('id').custom(id => isEntityExists(id, Tournament)),
  body().custom(async (tournamentId, { req }) => {
    const { id } = req.params;
    const tournamentRewards = await Tournament.findById(id).select('rewards');

    if (isEmpty(tournamentRewards)) {
      return true;
    }

    return true;
  })
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  const tournamentRewards = await Tournament
    .findById(id)
    .select('rewards')
    .lean();

  if (isEmpty(tournamentRewards)) {
    res.send({
      rewards: []
    });

    return;
  }

  const rewardsIds = Object.keys(tournamentRewards.rewards);

  const rewards = await Reward
    .find({ _id: { $in: rewardsIds } })
    .select('-key -isClaimed -userId');

  res.send(rewards);
});

export { handler, validator };
