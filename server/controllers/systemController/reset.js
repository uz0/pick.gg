import FantasyTournament from "../../models/fantasy-tournament";
import TournamentModel from "../../models/tournament";
import MatchResult from "../../models/match-result";
import MatchModel from "../../models/match";
import PlayerModel from "../../models/player";

export default async (req, res) => {
  await FantasyTournament.deleteMany();
  await TournamentModel.deleteMany();
  await MatchResult.deleteMany();
  await MatchModel.deleteMany();
  await PlayerModel.deleteMany();
  res.send({
    "success": "all data was resetted"
  });
}