import { param, body } from 'express-validator/check';

import TeamModel from '../../../models/team';
import { isEntityExists, isRequestHasCorrectFields } from '../../validators';
import { withValidationHandler } from '../../helpers';

const validator = [
  param('teamId').custom(id => isEntityExists(id, TeamModel)),
  body().not().isEmpty(),
  body().custom(values => isRequestHasCorrectFields(values, TeamModel))
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const team = await TeamModel.findByIdAndUpdate({ _id: req.params.teamId }, req.body, { new: true });
    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export { validator, handler };
