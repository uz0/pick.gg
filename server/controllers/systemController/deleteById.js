import FantasyTournament from "../../models/fantasy-tournament";

export default async (req, res) => {
  const { id } = req.param;
  await FantasyTournament.deleteOne({ _id: id });
  res.send({
    id,
    success: "success"
  });
}