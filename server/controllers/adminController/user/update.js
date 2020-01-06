import { withValidationHandler } from '../../helpers';

import UserModel from '../../../models/user';

const validator = [
  // body().custom(value => isRequestHasCorrectFields(value, UserModel))
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate({ _id: req.params.id },
      req.body,
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});

export { validator, handler };
