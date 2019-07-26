import { param, check, body } from 'express-validator/check';

import Tournament from '../../models/tournament';

import { isEntityExists, isUserHasToken } from '../validators';
import { withValidationHandler } from '../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id').custom(id => isEntityExists(id, Tournament)),
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, newStatus } = req.body;

  try {
    const newTournament = await Tournament
      .update(
        { _id: id },
        { $set: { [`applicants.$[element].status`]: newStatus } },
        { arrayFilters: [{ 'element.user': userId }] },
      )
      .exec();
  } catch (error){
    console.log(error);
    res.status(400).send({})
  }

  res.send({});
});

export { validator, handler };