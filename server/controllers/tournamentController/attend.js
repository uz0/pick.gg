import { param, body } from 'express-validator/check';

import Tournament from '../../models/tournament';
import User from '../../models/user';

import { isEntityExists } from '../validators';
import { withValidationHandler } from '../helpers';

export const validator = [
    param('id').custom(id => isEntityExists(id, Tournament)),
    param('id').custom(id =>
        Tournament.findById(id)
            .exec()
            .then(
                ({ isReady }) =>
                    !isReady || Promise.reject("Can't attend ready tournament")
            )
    ),
    body('userId')
        .isMongoId()
        .custom(id => isEntityExists(id, User))
        .custom(async (userId, { req }) => {
            const { id } = req.params;
            const { applicants, summoners } = await Tournament.findById(id).exec();

            const isAlreadyApplicantOrSummoner = summoners.includes(userId) || applicants.includes(userId)

            if (isAlreadyApplicantOrSummoner) {
                throw new Error('User already an applicant or summoner');
            }

            return true;
        })
];

export const handler = withValidationHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const modifiedTournament = await Tournament.findByIdAndUpdate(id, {
        $push: { applicants: userId }
    });

    await modifiedTournament.save();
    
    res.json(modifiedTournament);
});
