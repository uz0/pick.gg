import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import negate from 'lodash/negate';
import difference from 'lodash/difference'
import isUndefined from 'lodash/isUndefined';

import { param, body, check } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

import Tournament from '../../models/tournament';

import {
  isRequestHasCorrectFields,
  isUserHasToken,
  isEntityExists
} from '../validators';

import { withValidationHandler } from '../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id')
    .custom(id => isEntityExists(id, Tournament))
    .custom(async (tournamentId, { req }) => {
      const { _id, isAdmin } = req.decoded;

      const { creator, isReady } = await Tournament.findById(tournamentId);

      if (!isAdmin && String(creator) !== String(_id)) {
        throw new Error('You are not allowed to edit this tournament');
      }

      if (isReady) {
        const fieldsToExclude = ['name', 'description', 'imageUrl', 'summoners', 'rules'];
        const extraField = difference(Object.keys(req.body),fieldsToExclude)
        
        if(!extraField.length) throw new Error(`You can\'t edit next fields in ready tournament: ${extraField.join(', ')}`)
      }

      return true;
    }),
  
  body().custom(body => isRequestHasCorrectFields(body, Tournament)),
  body().custom(({ summoners }) => {
    if(!summoners){
      return true;
    }

    if(summoners.length > 10){
      throw new Error('You can\'t add more than 10 summoners');
    }

    return true;
  }),
  body().custom(({ rules, game }) => {
    if(!rules){
      return true;
    }

    return true;
  }),
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
        'imageUrl',
        'price',
        'rules',
        'summoners'
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
