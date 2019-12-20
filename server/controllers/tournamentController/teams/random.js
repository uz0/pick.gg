import mongoose from 'mongoose';
import pick from 'lodash/pick';
import map from 'lodash/map';
import union from 'lodash/union';
import defaults from 'lodash/defaults';
import { check, validationResult } from 'express-validator/check';

import TeamModel from '../../../models/team';
import TournamentModel from '../../../models/tournament';

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
  let teams = await TeamModel.find({ tournamentId: req.params.tournamentId });
  let users = [];

  teams.forEach((team, index) => {
    users = [...users, ...team.users];
    teams[index].users = [];
  });

  users.forEach(user => {
    const randomTeam = Math.floor(Math.random() * (teams.length));
    teams[randomTeam].users.push(user);
  });

  for (let i = 0; i < teams.length; i++) {
    await TeamModel.findOneAndUpdate({ _id: teams[i]._id }, { $set: {users: teams[i].users} });
  }

  const modifiedTournament = await TournamentModel.findOne({ _id: req.params.tournamentId });
  res.status(200).json({ tournament: modifiedTournament });
});

export { validator, handler };
