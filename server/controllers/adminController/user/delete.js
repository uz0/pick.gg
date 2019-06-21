import UserModel from '../../../models/user';
import { isEntityExists } from '../../validators';

import { check, validationResult } from 'express-validator/check';

const validator = [
  check('id')
    .custom(value => isEntityExists(value, UserModel))
];

const withValidationHandler = handler => (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return handler(req, res);
};

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