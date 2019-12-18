import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check, validationResult } from 'express-validator/check';

import TeamModel from '../../../models/team';

const validator = [
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
    const team = await TeamModel.findByIdAndUpdate({ _id: req.params.teamId }, req.body, { new: true });
    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export { validator, handler };
