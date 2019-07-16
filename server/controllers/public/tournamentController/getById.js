import { check, validationResult } from 'express-validator/check';
import TournamentModel from '../../../models/tournament';

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
        const tournament = await TournamentModel
        .findById(id)
        .populate('winner')
        .populate('creatorId')
        .populate('summoners')
        .populate('applicants')
        .populate('matches')
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