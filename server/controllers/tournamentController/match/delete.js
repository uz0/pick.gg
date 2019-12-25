import { param } from 'express-validator/check';

import TournamentModel from '../../../models/tournament';
import match from '../../../models/match';

import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';

export const validator = [
  param('tournamentId').custom(id => isEntityExists(id, TournamentModel)),
  param('matchId').custom(id => isEntityExists(id, match)),
  param().custom(async (_, { req }) => {
    const { tournamentId, matchId } = req.params;
    const { matches } = await TournamentModel.findById(tournamentId).populate('matches').exec();

    if (!matches.find(match => String(match._id) === String(matchId))) throw new Error("Match don't exist on this tournament");
  })
];

export const handler = withValidationHandler(async (req, res) => {
  const { matchId } = req.params;

  await match.remove({ _id: matchId });

  res.json({});
});
