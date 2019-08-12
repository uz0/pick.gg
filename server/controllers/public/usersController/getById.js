import { check, validationResult } from 'express-validator/check';
import UserModel from '../../../models/user';

const withValidationHandler = handler => (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return handler(req, res);
};

export const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findOne({ _id: id });
    res.json(user);
  } catch (error) {
    res.json({ error })
  }
})

export const validator = [
  check('id').isMongoId()
]