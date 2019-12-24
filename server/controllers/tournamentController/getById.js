import { check, validationResult } from 'express-validator/check';
import TournamentModel from '../../models/tournament';

import withValidationHandler from '../helpers/withValidationHandler'


export const handler = withValidationHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const tournament = await TournamentModel
        .findById(id)
        .populate('winner')
        .populate('creatorId')
        .populate('applicants')
        .populate('matches')
        .populate('teams')
        .populate('creator', '_id username summonerName')
        .exec();
        res.json(tournament);

    } catch (error) {
        res.json({error})
    }

})

export const validator = [
    check('id').isMongoId()
]