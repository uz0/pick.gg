import UserModel from '../../models/user';

import { withValidationHandler } from '../helpers';
import { check } from 'express-validator/check';

const isUserHasToken = (value, req) => {
  if(req.decoded){
    return true;
  }

  throw new Error(`You are not authorized`);
}

const validator = [
  check()
    .custom((value, { req }) => isUserHasToken(value, req))
];

const handler = withValidationHandler(async (req, res) => {
  const userId = req.decoded._id;

  try {
    const user = await UserModel.findOne({ _id: userId })
      .select('-password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };