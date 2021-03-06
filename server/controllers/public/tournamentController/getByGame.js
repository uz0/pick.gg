import TournamentModel from '../../../models/tournament';
import { check } from 'express-validator/check';
import { GAMES } from '../../../../common/constants';
import { withValidationHandler } from '../../helpers';

export const handler = withValidationHandler(async (req, res) => {
  const { game } = req.params;
  const tournaments = await TournamentModel
    .find({ game })
    .populate('winner')
    .populate('creatorId')
    .populate('summoners')
    .populate('moderators')
    .populate('applicants')
    .populate('matches')
    .exec();

  res.json({ tournaments });
});

export const validator = [
  check('game').isIn(GAMES)
];
