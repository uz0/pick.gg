import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import negate from 'lodash/negate';
import difference from 'lodash/difference'
import isUndefined from 'lodash/isUndefined';

import { param, body, check } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

import Tournament from '../../../models/tournament';

import {
  isRequestHasCorrectFields,
  isUserHasToken,
  isEntityExists
} from '../../validators';

import { withValidationHandler } from '../../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id')
    .custom(id => isEntityExists(id, Tournament))
    .custom(async (tournamentId, { req }) => {
      const { _id } = req.decoded;

      const { creator, isReady } = await Tournament.findById(tournamentId);

      if (String(creator) !== String(_id)) {
        throw new Error('You are not allowed to edit this tournament');
      }

      if (isReady) {
        throw new Error('You can\'t edit rewards after tournament has started');
      }

      return true;
    })
];

const handler = withValidationHandler((req, res) => {
  const { id } = req.params;
  const { rewards } = req.body;

  Tournament.findByIdAndUpdate(id, { $set: { rewards } }, { new: true })
    .exec()
    .then(res.json)
    .catch(error => res.json({ error }));
});

export { validator, handler };
