import express from "express";
import UserModel from "../models/user";
let router = express.Router();

const UsersController = () => {
  router.get('/', async (req, res) => {
    let users = await UserModel.find();
    res.json({ users });
  });

  router.get('/me', async (req, res) => {
    const userId = req.decoded._id;
    let user = await UserModel.findOne({ _id: userId });
    res.json({ user });
  });

  router.post('/me', async (req, res) => {
    const userId = req.decoded._id;
    const fields = {
      email: req.body.email,
      nickname: req.body.nickname,
      about: req.body.about,
    }
    
    const updatedUser = await UserModel
      .findOneAndUpdate({ _id: userId }, fields);

    res.json({
      id: "5c61c99b9810a7173819faa5",
      success: true,
      user: updatedUser,
    });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    let user = await UserModel.findOne({ _id: id });
    res.json({ user });
  });  

  return router;
}

export default UsersController;