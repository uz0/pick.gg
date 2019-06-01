import TournamentModel from "../../models/tournament";

export default async (req, res) => {
  const tournaments = await TournamentModel.find({})
    .populate('champions')
    .populate('matches');
  res.send({
    tournaments
  });
}