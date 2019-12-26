import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import negate from 'lodash/negate';
import difference from 'lodash/difference';
import isUndefined from 'lodash/isUndefined';

import { param, body, check } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

import TeamModel from '../../models/team';
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

      const { creator, isReady, moderators } = await Tournament.findById(tournamentId);

      const isModerator = moderators.includes(_id);

      if (!isAdmin && !isModerator && String(creator) !== String(_id)) {
        throw new Error('You are not allowed to edit this tournament');
      }

      if (isReady) {
        const fieldsToExclude = ['name', 'description', 'url', 'imageUrl', 'summoners', 'rules'];

        const extraField = difference(Object.keys(req.body), fieldsToExclude);

        if (!extraField.length) throw new Error(`You can't edit next fields in ready tournament: ${extraField.join(', ')}`);
      }

      return true;
    }),

  body().custom(body => isRequestHasCorrectFields(body, Tournament)),
  body().custom(({ summoners }) => {
    if (!summoners) {
      return true;
    }

    if (summoners.length > 10) {
      throw new Error('You can\'t add more than 10 summoners');
    }

    return true;
  }),
  body().custom(({ rules, game }) => {
    if (!rules) {
      return true;
    }

    return true;
  }),
  sanitizeBody().customSanitizer(values => pickBy(values, negate(isUndefined)))
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  if (req.body.summoners) {
    const tournamentBefore = await Tournament.findById(id).populate('teams').exec();
    const summonersBefore = [...tournamentBefore.summoners].map(item => `${item}`);
    const summonersAfter = [...req.body.summoners].map(item => `${item}`);
    const teams = [...tournamentBefore.teams];

    if (!teams || teams.length === 0) {
      await TeamModel.create({
        tournamentId: id,
        name: 'Team',
        color: 'black',
        users: req.body.summoners
      });
    } else {
      if (summonersAfter.length < summonersBefore.length) {
        const diff = difference(summonersBefore, summonersAfter);

        for (let i = 0; i < teams.length; i++) {
          for (let j = 0; j < teams[i].users.length; j++) {
            if (diff.includes(teams[i].users[j])) {
              await TeamModel.findByIdAndUpdate(teams[i]._id, {
                $pull: { users: teams[i].users[j] }
              });
            }
          }
        }
      }

      if (req.body.summoners.length > tournamentBefore.summoners.length) {
        const diff = difference(summonersAfter, summonersBefore);

        await TeamModel.findByIdAndUpdate(teams[0]._id, {
          $push: { users: diff }
        });
      }
    }
  }

  Tournament.findByIdAndUpdate(
    id,
    {
      $set: pick(req.body, [
        'name',
        'description',
        'imageUrl',
        'price',
        'rules',
        'dateDetails',
        'rulesTitle',
        'summoners',
        'moderators'
      ])
    },
    {
      new: true
    }
  )
    .populate('creatorId')
    .populate('applicants')
    .populate('matches')
    .populate('teams')
    .populate('creator', '_id username summonerName')
    .exec()
    .then(tournament => res.json({ tournament }))
    .catch(error => res.json({ error }));
});

export { validator, handler };
