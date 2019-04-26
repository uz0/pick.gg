import express from "express";
import PlayerModel from "../models/player";

import TournamentModel from '../models/tournament';
import MatchModel from '../models/tournament';

let router = express.Router();

const StreamerController = () => {
  router.get('/', async (req, res) => {
    let players = await PlayerModel.find();
    res.json({ players });
  });

  router.post('/players', async (req, res) => {
    const { name, photo, position } = req.body;

    if(name.length > 20){
      res.status(400).send({
        error: 'Name can not contain more than 20 characters',
      })
    }

    if(!position){
      res.status(400).send({
        error: 'Position field is required',
      })
    }

    const player = await PlayerModel.create({
      name,
      photo,
      position
    });

    res.send({ player });
  });

  router.get('/players', async (req, res) => {
    const players = await PlayerModel.find();
    res.json({ players });
  });

  router.post('/tournament', async (req, res) => {
    const { name, photo, position } = req.body;






    // id: { type: String },
    // name: { type: String, required: true },
    // date: { type: Date, required: true },
    // champions_ids: [String],
    // matches_ids: [String],
    // syncType: { type: String, enum: ['auto', 'manual'] },
    // origin: { type: String, enum: ['escore', 'manual'] },


    // {
    //   name        : { type: String, required: true },
    //   entry       : { type: Number, required: true },
    //   tournament  : { type: Schema.Types.ObjectId, ref: 'Tournament' },
    
    //   users       : [{
    //     _id: { type: Schema.Types.ObjectId, ref: 'User' },
    //     user: { type: Schema.Types.ObjectId, ref: 'User' },
    //     players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    //   }],
    
    //   rules: [{
    //     _id: { type: Schema.Types.ObjectId, ref: 'Rule' },
    //     rule: { type: Schema.Types.ObjectId, ref: 'Rule' },
    //     score: { type: Number },
    //   }],
    
    //   thumbnail: { type: String, default: '' },
    
    //   winner: { type: Schema.Types.ObjectId, ref: 'User' },
    //   creator: { type: Schema.Types.ObjectId, ref: 'User' },
    // },




    // const { tournament } = req.body;
    // const newTournament = await TournamentModel.create(tournament);




    res.send({ player });
  });

  return router;
}

export default StreamerController;