import { param, body, check } from 'express-validator/check';

// import Tournament from '../../models/tournament';
// import User from '../../models/user';
import Tournament from '../../models/tournament'

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';

export const validator = [
  param('id').custom(id => isEntityExists(id, Tournament)),
  check('id')
    .custom(async (_, { req }) => {
      const { _id: userId } = req.decoded;
      const { summoners } = req.body;
      const { id } = req.params;

      try {
        // const tournament = await Tournament.find({ _id: id });
        // const isAlreadyViewer = tournament.viewers.find(viewer => viewer.userId === userId);
  
        // if (isAlreadyViewer) {
        //   throw new Error('User already is a viewer');
        // }
  
        // if(!summoners){
        //   throw new Error("You can't apply as an viewer without choosing summoners");
        // }
  
        // if(summoners.length > 5){
        //   throw new Error("You can't choose more than 5 summoners");
        // }
      } catch (error) {
        console.log(error);
      }
      return true;
    })
];

export const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.decoded;
  const { summoners } = req.body;

  await Tournament.update(
    { _id: id },
    { $push: { viewers: { userId, summoners } }
  });

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
