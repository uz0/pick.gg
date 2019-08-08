import { param } from 'express-validator/check';

import Tournament from '../../models/tournament';

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';

export const validator = [
  param('id').custom(id => isEntityExists(id, Tournament)),
  param('id').custom(async id => {
    const { isStarted } = await Tournament.findById(id).exec();

    if (isStarted) throw new Error('Tournamnet is already started');

    return true;
  })
];

export const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  await Tournament.update(
    { _id: id },
    {
      $set: {
        isStarted: true,
        isForecastingActive: false
      }
    },
    { new: true }
  ).exec();

  const modifiedTournament = await Tournament
    .findById(id)
    .populate('winner')
    .populate('creatorId')
    .populate('applicants')
    .populate('matches')
    .populate('creator', '_id username summonerName')
    .exec();

  res.json(modifiedTournament);
});
