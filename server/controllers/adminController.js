import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournamentModel from "../models/fantasy-tournament";
import MatchModel from "../models/match";
import MatchResultModel from "../models/match-result";
import PlayerModel from "../models/player";
import UserModel from "../models/user";

let router = express.Router();

const AdminController = () => {
  router.get('/tournaments/real', async (req, res) => {
    const tournaments = await TournamentModel.find();
    res.json({ tournaments });
  });

  router.get('/tournaments/fantasy', async (req, res) => {
    const tournaments = await FantasyTournamentModel.find();
    res.json({ tournaments });
  });

  router.get('/matches', async (req, res) => {
    const matches = await MatchModel.find();
    res.json({ matches });
  });

  router.get('/players', async (req, res) => {
    const players = await PlayerModel.find();
    res.json({ players });
  });

  router.get('/results', async (req, res) => {
    const results = await MatchResultModel.find({playersResults: {$gt: []}});
    res.json({ results });
  });

  router.get('/users', async (req, res) => {
    const users = await UserModel.find();
    res.json({ users });
  });

  return router;
}

export default AdminController;