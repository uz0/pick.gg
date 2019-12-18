import mongoose from 'mongoose';
import pick from 'lodash/pick';
import defaults from 'lodash/defaults';
import { check, validationResult } from 'express-validator/check';

import TeamModel from '../../../models/team';

const validator = [
];

const withValidationHandler = handler => (req, res) => {
  return handler(req, res);
};

const handler = withValidationHandler(async (req, res) => {
  await TeamModel.remove({ _id: req.params.teamId });
  // await TeamModel.remove();
  res.json({ success: true });
});

export { validator, handler };
