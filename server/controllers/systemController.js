import express from "express";
import TournamentModel from "../models/tournament";
import FantasyTournament from "../models/fantasy-tournament";
import UserModel from "../models/user";
import RuleModel from "../models/rule";
import TransactionModel from "../models/transaction";
import MatchResult from "../models/match-result";
import MatchModel from "../models/match";

import MockService from "../mockService";


let router = express.Router();

const SystemController = () => {

  router.get('/sync', async (req, res) => {


    let champions = ["Xyp9x", "Edward", "Snax", "dennis", "flamie", "neo", "deVVe", "Zeus", "shox", "s1mple"];

    let championsResults = champions.map(item => {
      let result = MockService.generatePlayerResult(item);
      return result;
    })

    // await TournamentModel.deleteMany();
    // await MatchResult.deleteMany();
    // await MatchModel.deleteMany();

    // const tournament = await TournamentModel.create({
    //   name: MockService.getRandomTournamentName(),
    //   date: Date.now(),
    //   champions: MockService.getRandomTournamentChampions()
    // })

    // 5c76942f3962ed192c4a74ce <- tournament ID
    // 5c76893b6bf0d51228448549 <- match ID
    // 5c76952316aa212238afe833 <- match result ID

    // const match = await MatchModel.findByIdAndUpdate("5c76946ef7d8d40e1871b616", {
    //   results: "5c76952316aa212238afe833",
    // })

    // const matchShow = await MatchModel.findById("5c76946ef7d8d40e1871b616")

    // const match = await MatchModel.create({
    //   tournament: "5c76942f3962ed192c4a74ce",
    //   date: Date.now(),
    //   completed: false,
      // results: { type: Schema.Types.ObjectId, ref: 'MatchResult' },
    // })

    // const match = await MatchResult.create({
    //   matchId: "5c76946ef7d8d40e1871b616",
    //   playersResults: championsResults,
    // })

    // const tournament = await TournamentModel.findByIdAndUpdate("5c76942f3962ed192c4a74ce", {$push: {matches: "5c76946ef7d8d40e1871b616"}})
    // const tournament = await TournamentModel.findById("5c7688c615c0da10048c9e7f").populate('matches')

    // const match = await MatchModel.find({_id:"5c76893b6bf0d51228448549"})

    // let tournaments = await TournamentModel.find({_id: "5c76942f3962ed192c4a74ce"})
    //   .populate('matches.results')
    //   .populate({
    //     path: 'matches',
    //     populate: {
    //       path: 'results',
    //       model: 'MatchResult',
    //       select: 'playersResults'
    //     }
    //   });

    // await TournamentModel.deleteOne({_id:"5c7688c615c0da10048c9e7e"})
    // await TournamentModel.deleteOne({_id:"5c7688c615c0da10048c9e7f"})
    // const tournaments = await TournamentModel
      // .findById("5c7688c615c0da10048c9e7f")
      // .populate('matches')
      // .exec((err, match) => match.save());
    // console.log(tournaments)

    res.send({
      tournaments,
      // match,
      // matchShow,
      "success": "success"
    });

  })
  

  router.get('/finalize', async (req, res) => {});

  return router;
}

export default SystemController