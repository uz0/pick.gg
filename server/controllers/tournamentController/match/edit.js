import { param, body } from 'express-validator/check';
import omit from 'lodash/omit';
import map from 'lodash/map';

import tournament from '../../../models/tournament';
import match from '../../../models/match';

import { isEntityExists, isRequestHasCorrectFields } from '../../validators';
import { withValidationHandler } from '../../helpers';

export const validator = [
  param('tournamentId').custom(id => isEntityExists(id, tournament)),
  param('matchId').custom(id => isEntityExists(id, match)),
  param().custom(async (_, { req }) => {
    const { tournamentId, matchId } = req.params;

    const { matches } = await tournament
      .findById(tournamentId)
      .populate('matches')
      .exec();

    if (!map(matches, match => `${match._id}`).includes(matchId)) throw new Error("Match don't exist on this tournament");
  }),
  body()
    .not()
    .isEmpty(),
  body().custom(values => isRequestHasCorrectFields(values, match))
];

export const handler = withValidationHandler(async (req, res) => {
  const { matchId } = req.params;
  const matchUpdate = req.body;

  const newMatch = await match.findByIdAndUpdate(matchId, { $set: omit(matchUpdate, ['_id']) });

  res.json(newMatch);
});
