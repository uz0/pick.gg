import TournamentModel from '../../../models/tournament';

export default async (req, res) => {
  const { userId } = req.params;
  const { quantity } = req.query;

  const tournamentLimit = quantity ? Number(quantity) : 6;

  const tournaments = await TournamentModel
    .find({ $or: [
      { creator: userId },
      { summoners: { $in: [userId] } },
      { viewers: { $elemMatch: { userId } } },
    ]})
    .populate('winner')
    .populate('creatorId')
    .populate('summoners')
    .populate('moderators')
    .populate('applicants')
    .populate('matches')
    .populate('teams')
    .limit(tournamentLimit)
    .lean();

  res.json({ tournaments });
}