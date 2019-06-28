import TournamentModel from '../../models/tournament';

export default async (req, res) => {
    const tournaments = await TournamentModel
      .find({})
      .populate('winner')
      .populate('creatorId')
      .populate('summoners')
      .populate('applicants')
      .populate('matches')
      .exec();
    
    res.json({ tournaments });
}