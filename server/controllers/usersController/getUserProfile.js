import { check } from 'express-validator/check';

import UserModel from '../../models/user';

import { withValidationHandler } from '../helpers';
import { isUserHasToken } from '../validators';

const validator = [
  check()
    .custom((value, { req }) => isUserHasToken(value, req))
];

const handler = withValidationHandler(async (req, res) => {
  const { _id } = req.decoded;

  try {
    const user = await UserModel.findOne({ _id })
      .select('-password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
