import { param, body } from 'express-validator/check';

import TournamentModel from '../../../models/tournament';
import MatchModel from '../../../models/match';

import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';

export const validator = [
  param('tournamentId').custom(id => isEntityExists(id, TournamentModel)),
  body().not().isEmpty()
];

export const handler = withValidationHandler(async (req, res) => {
  const { tournamentId } = req.params;
  const { game, name, teams } = req.body;

  const match = {
    name,
    tournamentId
  };

  if (game === 'LOL') {
    match.teams = {
      [game]: { ...teams }
    };
  }

  // В будущем переписать через try catch, провалидировать ошибки
  const newMatch = await MatchModel.create(match);

  res.status(200).json(newMatch);
});
