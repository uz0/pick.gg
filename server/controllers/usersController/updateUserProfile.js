import { body } from 'express-validator/check';
import pick from 'lodash/pick';

import UserModel from '../../models/user';

import { isRequestHasCorrectFields, isUserHasToken } from '../validators';

import { withValidationHandler } from '../helpers';

const validator = [
  body()
    .custom((value, { req }) => isUserHasToken(value, req))
    .custom(value => isRequestHasCorrectFields(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  const { _id } = req.decoded;

  try {
    const user = await UserModel.findOneAndUpdate({ _id },
      pick(req.body, [
        'username',
        'imageUrl',
        'about',
        'twitchAccount',
        'summonerName',
        'regionId',
        'preferredPosition',
      ]),
      { new: true },
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
