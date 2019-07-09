import UserModel from '../../../models/user';
import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';

import { param } from 'express-validator/check';

const validator = [
  param('id')
    .custom(value => isEntityExists(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserModel
    .findById(id)
    .select('-password')

  res.json(user);
});

export { validator, handler };