import { param, body } from 'express-validator/check';

import tournament from '../../../models/tournament';
import match from '../../../models/match';

import { isEntityExists, isRequestHasCorrectFields } from '../../validators';
import { withValidationHandler } from '../../helpers';

export const validator = [
  param('tournamentId').custom(id => isEntityExists(id, tournament)),
  body().not().isEmpty(),
  body().custom(values => isRequestHasCorrectFields(values, match))
];

export const handler = withValidationHandler(async (req, res) => {
  const { tournamentId } = req.params;
  const matchInfo = req.body;

  const newMatch = await match.create(matchInfo);
  await tournament.findByIdAndUpdate(tournamentId, { $push: { matches: newMatch._id } }).exec();

  res.json(newMatch);
});
