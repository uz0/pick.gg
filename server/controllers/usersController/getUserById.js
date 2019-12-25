import { param } from 'express-validator/check';

import UserModel from '../../models/user';

import { withValidationHandler } from '../helpers';
import { isEntityExists } from '../validators';

const validator = [
  param('id')
    .custom((value, req) => isEntityExists(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  const userId = req.params.id;

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
