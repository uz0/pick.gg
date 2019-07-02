import UserModel from '../../models/user';

import pick from 'lodash/pick';

import { body } from 'express-validator/check';
import { isRequestHasCorrectFields, isEntityExists } from '../validators';

import { withValidationHandler } from '../helpers';

const isUserCanEditProfile = (value, req) => {
  if(req.decoded){
    return true;
  }

  throw new Error(`You are not authorized`);
}

const validator = [
  body()
    .custom((value, { req }) => isUserCanEditProfile(value, req))
    .custom(value => isRequestHasCorrectFields(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  const userId = req.decoded._id;

  try {
    const user = await UserModel.findOneAndUpdate({ _id: userId },
      pick(req.body, [
        'username',
        'imageUrl',
        'about',
        'twitchAccount',
        'summonerName',
        'regionId',
        'preferredPosition',
      ]),
      {new: true},
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
