import express from "express";
import PlayerModel from "../models/player";

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

  return router;
}

export default StreamerController;