import pick from 'lodash/pick'
import { check, validationResult } from 'express-validator/check';

import TournamentModel from '../../models/tournament';

const validator = [
  check('tournamentId')
    .not()
    .isEmpty()
    .withMessage('Enter tournament'),
  check('name')
    .isString()
    .not().isEmpty().withMessage('Enter name'),
  check('price')
    .not().isEmpty().withMessage('Enter entry price'),
  check('rules')
    .isArray()
    .not().isEmpty()
];

const withValidationHandler = handler => (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    handler(req,res)
}

const handler = async (req, res) => {
  try {
    const newTournament = await TournamentModel.create({
        ...pick(req.body,[
            'name',
            'description',
            'rules',
            'imageUrl',
            'price'
        ])
    });
    
    res.json({
      success: true,
      newTournament
    });
  } catch (error) {
    res.json({
      success: false,
      error
    });
  }
};

export default [validator, handler];
