import express from "express";
import PlayerModel from "../models/player";

let router = express.Router();

const StreamerController = () => {
  router.get('/', async (req, res) => {
    let players = await PlayerModel.find();
    res.json({ players });
  });

  return router;
}

export default StreamerController;