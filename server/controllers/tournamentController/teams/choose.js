import { check, validationResult } from 'express-validator/check';

import TeamModel from '../../../models/team';
import TournamentModel from '../../../models/tournament';

const validator = [
  check('userId')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Check user')
];

const withValidationHandler = handler => (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return handler(req, res);
};

const handler = withValidationHandler(async (req, res) => {
  try {
    await TeamModel.update({
      _id: { $ne: req.params.teamId },
      tournamentId: req.params.tournamentId
    }, { $pull: { users: req.body.userId } }, { multi: true });

    await TeamModel.findOneAndUpdate({ _id: req.params.teamId }, { $addToSet: { users: req.body.userId } });

    const modifiedTournament = await TournamentModel
      .findById(req.params.tournamentId)
      .populate('creatorId')
      .populate('applicants')
      .populate('matches')
      .populate('teams')
      .populate('creator', '_id username summonerName')
      .exec();

    res.status(200).json({ tournament: modifiedTournament });
  } catch (error) {
    res.status(500).json(error);
  }
});

export { validator, handler };
