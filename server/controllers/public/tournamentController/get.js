import TournamentModel from '../../../models/tournament';

export default async (req, res) => {
  const tournaments = await TournamentModel
    .find({})
    .populate('winner')
    .populate('creatorId')
    .populate('summoners')
    .populate('moderators')
    .populate('applicants')
    .populate('matches')
    .populate('teams')
    .exec();

  res.json({ tournaments });
};
