import { param, body } from 'express-validator/check';

import tournament from '../../../models/tournament';
import match from '../../../models/match';

import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';

export const validator = [
  param('tournamentId').custom(id => isEntityExists(id, tournament)),
  param('matchId').custom(id => isEntityExists(id, match)),
  body()
    .not()
    .isEmpty()
];

export const handler = withValidationHandler(async (req, res) => {
  const { matchId } = req.params;
  const results = req.body;

  const newMatch = await match
    .findByIdAndUpdate(matchId, { $set: { playersResults: results }}, { new: true, upsert: false })
    .exec();

  res.json(newMatch);
});

