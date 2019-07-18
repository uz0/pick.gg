import { param, check, body } from 'express-validator/check';

import Tournament from '../../models/tournament';

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id')
    .custom(id => isEntityExists(id, Tournament)),
    body().not().isEmpty()
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  const [$set, arrayFilters] = Object.entries(req.body).reduce(
    ([set, arrayFilter], { userId, newStatus }) => [
      { ...set, [`applicants.$[${userId}].status`]: newStatus },
      { ...arrayFilter, [`${userId}.user`]: userId }
    ],
    [{}, {}]
  );

  const newTournament = await tournament
    .findByIdAndUpdate(id, { $set }, { upsert: false, arrayFilters })
    .exec();

});

export { validator, handler };
