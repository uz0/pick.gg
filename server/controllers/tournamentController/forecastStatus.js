import { param } from 'express-validator/check';

import Tournament from '../../models/tournament';

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';

export const validator = [
  param('id').custom(id => isEntityExists(id, Tournament)),
  param('id').custom(async id => {
    const { isForecastingActive } = await Tournament.findById(id).exec();

    if (isForecastingActive) throw new Error('Forecasting is already avalilable');

    return true;
  })
];

export const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  await Tournament.update(
    { _id: id },
    { $set: { isForecastingActive: true } },
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
