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
    const tournaments = await TournamentModel
    .find()
    .populate('champions')
    .populate('matches')
    
    res.json({ tournaments });
  });

  router.put('/tournaments/real/', async (req, res) => {
    const { tournamentId, tournament } = req.body;

    const updatedTournament = await TournamentModel.findByIdAndUpdate(tournamentId,
      {
        name: tournament.name,
        date: tournament.date,
        champions: tournament.champions,
        champions_ids: tournament.champions_ids,
      },
      {
        upsert: true,
      },
    );

    res.json({ tournament: updatedTournament });
  });

  router.get('/tournaments/fantasy', async (req, res) => {
    const tournaments = await FantasyTournamentModel.find();
    res.json({ tournaments });
  });

  router.get('/matches', async (req, res) => {
    const matches = await MatchModel.find();
    res.json({ matches });
  });

  router.get('/matches/:id', async (req, res) => {
    const matchId = req.params.id;
    const match = await MatchModel.find({id: matchId})

    res.json({ match });
  });

  router.get('/players', async (req, res) => {
    const players = await PlayerModel.find();
    res.json({ players });
  });

  router.get('/results', async (req, res) => {
    const results = await MatchResultModel.find({playersResults: {$gt: []}});
    res.json({ results });
  });

  router.get('/results/:id', async (req, res) => {
    const resultId = req.params.id;
    const result = await MatchResultModel
      .findById(resultId)
      .populate('playersResults.results.rule')

    res.json({ result });
  });

  router.put('/results', async (req, res) => {
    const { results, matchId } = req.body;

    const matchResult = await MatchResultModel.findOneAndUpdate({ matchId }, { playersResults: results });

    res.json({ matchResult });
  });

  router.get('/users', async (req, res) => {
    const users = await UserModel.find();
    res.json({ users });
  });

  return router;
}

export default AdminController;