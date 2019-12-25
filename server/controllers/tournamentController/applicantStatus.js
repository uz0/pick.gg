import { param, check } from 'express-validator/check';

import Tournament from '../../models/tournament';

import { isEntityExists, isUserHasToken } from '../validators';
import { withValidationHandler } from '../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id').custom(id => isEntityExists(id, Tournament))
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, newStatus } = req.body;

  try {
    const newTournament = await Tournament
      .update(
        { _id: id },
        { $set: { 'applicants.$[element].status': newStatus } },
        { arrayFilters: [{ 'element.user': userId }] }
      )
      .exec();

    if (newStatus === 'ACCEPTED') {
      await Tournament
        .update(
          { _id: id },
          { $push: { summoners: userId } }
        )
        .exec();
    }

    res.send(newTournament);
  } catch (error) {
    console.log(error);
    res.status(400).send({});
  }
});

export { validator, handler };
