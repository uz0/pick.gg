import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check } from 'express-validator/check';
import { withValidationHandler } from '../../helpers';
import { isPropertyValueUnique } from '../../validators';
import { REGIONS } from '../../../../common/constants';

import UserModel from '../../../models/user';

const validator = [
  check('username')
    .isString()
    .not()
    .isEmpty()
    .withMessage("Username field shouldn't be empty")
    .isLength({ min: 1, max: 20 })
    .withMessage('username should contain more than 1 char and less than 20')
    .custom(value => isPropertyValueUnique({ username: value }, UserModel)),
  check('email')
    .isString()
    .not()
    .isEmpty()
    .withMessage("Email field shouldn't be empty")
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ min: 5, max: 30 })
    .withMessage('Email should contain more than 5 chars and less than 30')
    .custom(value => isPropertyValueUnique({ email: value }, UserModel)),
  check('summonerName')
    .custom(value => isPropertyValueUnique({ summonerName: value }, UserModel)),
  check('regionId')
    .isIn(REGIONS)
    .withMessage('Invalid region'),
  check('role')
    .isIn(['user', 'admin', 'streamer'])
    .withMessage('Invalid user role'),
  check('preferredPosition')
    .isIn(['adc', 'mid', 'top', 'jungle', 'supp'])
    .withMessage('Invalid preffered position')
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const user = await UserModel.create(
      defaults(
        pick(req.body, [
          'username',
          'email',
          'imageUrl',
          'about',
          'role',
          'summonerName',
          'regionId',
          'preferredPosition'
        ]),
        {
          imageUrl: '',
          about: '',
          role: '',
          summonerName: '',
          regionId: '',
          preferredPosition: ''
        }
      )
    );

    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
