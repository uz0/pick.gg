import express from "express";
import PlayerModel from "../../models/player";

let router = express.Router();

const PublicPlayersController = () => {
  router.get('/', async (req, res) => {
    const players = await PlayerModel.find();
    res.json({ players });
  });

  return router;
}

export default PublicPlayersController;