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

    if (!matches.includes(matchId))
      throw new Error("Match don't exist on this tournament");
  }),
  body()
    .not()
    .isEmpty()
];

export const handler = withValidationHandler(async (req, res) => {
  const { matchId } = req.params;
  const rawResults = req.body;

  const [$set, arrayFilters] = normaliseResults(rawResults).reduce(
    ([set, arrayFilter], { userId, results }) => [
      { ...set, [`results.$[${userId}].results`]: results },
      { ...arrayFilter, [`${userId}.userId`]: userId }
    ],
    [{}, {}]
  );

  const newMatch = await match
    .findByIdAndUpdate(matchId, { $set }, { upsert: false, arrayFilters })
    .exec();

  res.json(newMatch);
});

