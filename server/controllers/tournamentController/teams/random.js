import { param } from 'express-validator/check';

import { isEntityExists } from '../../validators';
import { withValidationHandler } from '../../helpers';
import TeamModel from '../../../models/team';
import TournamentModel from '../../../models/tournament';

const validator = [
  param('tournamentId').custom(id => isEntityExists(id, TournamentModel))
];

const handler = withValidationHandler(async (req, res) => {
  try {
    const teams = await TeamModel.find({ tournamentId: req.params.tournamentId });
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
      await TeamModel.findOneAndUpdate({ _id: teams[i]._id }, { $set: { users: teams[i].users } });
    }

    const modifiedTournament = await TournamentModel
      .findById(req.params.tournamentId)
      .populate('creatorId')
      .populate('applicants')
      .populate('matches')
      .populate('teams')
      .populate('creator', '_id username summonerName')
      .exec();

    res.status(200).json({ tournament: modifiedTournament });
  } catch (error) {
    res.status(500).json(error);
  }
});

export { validator, handler };
