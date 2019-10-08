import isEmpty from 'lodash/isEmpty';
import Tournament from '../../../models/tournament';
import Reward from '../../../models/reward';

import { param, body, check } from 'express-validator/check';

import {
  isUserHasToken,
  isEntityExists
} from '../../validators';

import { withValidationHandler } from '../../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('tournamentId').custom(id => isEntityExists(id, Tournament)),
  body().custom(async (id, { req }) => {
    const { tournamentId } = req.params;
    const tournamentRewards = await Tournament.findById(tournamentId).select('rewards');

    if(isEmpty(tournamentRewards)){
      return true;
    }

    return true;
  }),
];

const handler = withValidationHandler(async (req, res) => {
  const { tournamentId } = req.params;

  const tournamentRewards = await Tournament
    .findById(tournamentId)
    .select('rewards')
    .lean();

  if(isEmpty(tournamentRewards)){
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
