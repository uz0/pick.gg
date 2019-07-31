import { param, body, check } from 'express-validator/check';

import Tournament from '../../models/tournament';
import User from '../../models/user';

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';

export const validator = [
  param('id').custom(id => isEntityExists(id, Tournament)),
  param('id').custom(id =>
    Tournament.findById(id)
      .exec()
      .then(
        ({ isReady }) =>
          !isReady || Promise.reject("You can't apply as viewer if tournament is ready")
      )
  ),
  check('userId')
    .custom(async (_, { req }) => {
      const { _id: userId } = req.decoded;
      const { summoners } = req.body;
      const { id } = req.params;

      const { viewers } = await Tournament.findById(id).exec();

      const isAlreadyViewer = viewers.find(viewer => viewer.userId === userId);

      if (isAlreadyViewer) {
        throw new Error('User already is a viewer');
      }

      if(!summoners){
        throw new Error("You can't apply as an viewer without choosing summoners");
      }

      if(summoners.length > 5){
        throw new Error("You can't choose more than 5 summoners");
      }

      return true;
    })
];

export const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.decoded;
  const { summoners } = req.body;

  await Tournament
  .update(
    { _id: id },
    { $push: { viewers: { userId, summoners } }
  })
  .save();

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
