import express from "express";
import UserModel from "../models/user";
import filter from 'lodash/filter';
let router = express.Router();

const UsersController = () => {
  router.get('/', async (req, res) => {
    let users = await UserModel.find();
    res.json({ users });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    let user = await UserModel.findOne({ _id: id });
    res.json({ user });
  });

  router.get('/me', async (req, res) => {
    const userId = req.decoded._id;
    let user = await UserModel.findOne({ _id: userId });
    res.json({ user });
  });

  router.post('/me', async (req, res) => {
    const userId = req.decoded._id;
    const fields = {
      username: req.body.username,
      email: req.body.email,
      about: req.body.about,
      password: req.body.password,
    }

    const updatingFields = filter(fields, (value) => !!value);

    const updatedUser = await UserModel
      .findOneAndUpdate({ _id: userId }, updatingFields);

    res.json({
      success: true,
      user: updatedUser,
    });
  });

  return router;
}

export default UsersController;