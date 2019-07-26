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
  const { status, user } = req.body;

  await Tournament
    .findByIdAndUpdate(id, { [`applicants.$[${user}].status`]: status }, { upsert: false })
    .exec();

  res.send({});
});

export { validator, handler };
