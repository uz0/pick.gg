import { param, body } from 'express-validator/check';
import uniqBy from 'lodash/uniqBy';

import tournament from '../../../models/tournament';
import match from '../../../models/match';

import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';

import { normaliseResults } from './helpers';

export const validator = [
  param('tournamentId').custom(id => isEntityExists(id, tournament)),
  param('matchId').custom(id => isEntityExists(id, match)),
  param('matchId').custom(async (_, { req }) => {
    const { tournamentId, matchId } = req.params;
    const { matches } = await tournament.findById(tournamentId).exec();

    if (!matches.includes(matchId)) throw new Error("Match don't exist on this tournament");
  }),
  body()
    .not()
    .isEmpty()
];

export const handler = withValidationHandler(async (req, res) => {
  const { matchId } = req.params;
  const rawResults = req.body;

  const results = normaliseResults(rawResults);

  const newMatch = await match.findByIdAndUpdate(
    matchId,
    {
      $push: {
        results: {
          $each: uniqBy(results, 'userId')
        }
      }
    },
    { new: true }
  );

  res.json(newMatch);
});
