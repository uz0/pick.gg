import TournamentModel from '../../models/tournament';

export default async (req, res) => {
    const tournaments = await TournamentModel
      .find({})
      .populate('tournament', 'name date')
      .populate({ path: 'users.players', select: 'id name' })
      .populate({ path: 'users.user', select: '_id username' })
      .sort({ date: -1 });
    res.json({ tournaments });
}