import TournamentModel from '../../models/tournament';
import MatchModel from '../../models/match';

export default async (req, res) => {
    const tournaments = await TournamentModel
      .find({})
      .populate('winner')
      .populate('creatorId')
      .populate('summoners')
      .populate('applicants')
      .populate('matches')
      .populate('teams')
      .exec();

    const teams = await TeamsModel.find({});

    res.json({ tournaments });
}