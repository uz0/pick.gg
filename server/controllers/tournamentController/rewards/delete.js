import { param, body, check } from 'express-validator/check';

import Tournament from '../../../models/tournament';
import Reward from '../../../models/reward';

import {
  isUserHasToken,
  isEntityExists
} from '../../validators';

import { withValidationHandler } from '../../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('tournamentId')
    .custom(id => isEntityExists(id, Tournament))
    .custom(async (tournamentId, { req }) => {
      const { _id, isAdmin } = req.decoded;

      const { creator, isReady } = await Tournament.findById(tournamentId);

      if (!isAdmin && String(creator) !== String(_id)) {
        throw new Error('You are not allowed to edit this tournament');
      }

      if (isReady) {
        throw new Error('You can\'t edit rewards after tournament has started');
      }

      return true;
    }),
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  const { rewards } = req.body;

  await Tournament.update({ _id: id }, { $set: { rewards } }, { new: true }).exec();

  const modifiedTournament = await Tournament
    .findById(id)
    .populate('creatorId')
    .populate('applicants')
    .populate('matches')
    .populate('creator', '_id username summonerName')
    .exec();

  res.json(modifiedTournament);
});

export { validator, handler };
