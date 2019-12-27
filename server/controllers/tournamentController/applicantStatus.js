import { param, check } from 'express-validator/check';

import Tournament from '../../models/tournament';
import TeamModel from '../../models/team';

import { isEntityExists, isUserHasToken } from '../validators';
import { withValidationHandler } from '../helpers';

const validator = [
  check().custom((value, { req }) => isUserHasToken(value, req)),
  param('id').custom(id => isEntityExists(id, Tournament))
];

const handler = withValidationHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, newStatus } = req.body;

  const tournament = await Tournament.findById(id).populate('teams').exec();

  try {
    if (newStatus === 'ACCEPTED') {
      if (!tournament.teams || tournament.teams.length === 0) {
        await TeamModel.create({
          tournamentId: id,
          name: 'Team',
          color: 'black',
          users: [userId]
        });
      } else {
        const defaultTeamId = tournament.teams[0]._id;

        await TeamModel.findByIdAndUpdate(
          { _id: defaultTeamId },
          { $push: { users: userId } }
        );
      }

      await Tournament
        .update(
          { _id: id },
          { $push: { summoners: userId } }
        )
        .exec();
    }

    await Tournament
      .updateOne(
        { _id: id },
        { $set: { 'applicants.$[element].status': newStatus } },
        { arrayFilters: [{ 'element.user': userId }] }
      )
      .exec();

    const newTournament = await Tournament
      .findById(id)
      .populate('winner')
      .populate('creatorId')
      .populate('matches')
      .populate('teams')
      .populate('creator', '_id username summonerName')
      .exec();

    res.send(newTournament);
  } catch (error) {
    console.log(error);
    res.status(400).send({});
  }
});

export { validator, handler };
