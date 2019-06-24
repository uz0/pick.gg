import UserModel from '../../../models/user';
import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';

import { check } from 'express-validator/check';

const validator = [
  check('id')
    .custom(value => isEntityExists(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  try {
    await UserModel
      .remove({ _id: req.params.id });
    res.json({});
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };