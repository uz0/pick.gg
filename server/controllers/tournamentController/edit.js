import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import negate from 'lodash/negate';
import isUndefined from 'lodash/isUndefined';

import { param, body, check } from 'express-validator/check';

import Tournament from '../../models/tournament';

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';
import { sanitizeBody } from 'express-validator/filter';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id')
    .custom(id => isEntityExists(id, Tournament))
    .custom(async (tournamentId, { req }) => {
      const { _id } = req.decoded;

      const { creator } = await Tournament.findById(tournamentId);

      if (creator !== _id) {
        throw new Error('You are not allowed to edit this tournament');
      }

      return true;
    }),
  body().custom(body => isRequestHasCorrectFields(body, Tournament)),
  sanitizeBody().customSanitizer(values => pickBy(values, negate(isUndefined)))
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  Tournament.findByIdAndUpdate(
    id,
    {
      $set: pick(req.body, [
        'name',
        'description',
        'url',
        'price',
        'rewards',
        'rules'
      ])
    },
    {
      new: true
    }
  )
    .exec()
    .then(res.json)
    .catch(error => res.json({ error }));
});

export { validator, handler };
