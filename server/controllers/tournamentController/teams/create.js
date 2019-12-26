import { check, validationResult } from 'express-validator/check';

import TeamModel from '../../../models/team';

const validator = [
  check('name')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter name'),
  check('color')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Enter color')
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
    const team = await TeamModel.create({
      tournamentId: req.params.tournamentId,
      name: req.body.name,
      color: req.body.color,
      users: []
    });

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export { validator, handler };
