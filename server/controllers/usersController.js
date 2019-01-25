import express from "express";
import UserModel from "../models/user";
let router = express.Router();

const UsersController = () => {
  router.get('/', async (req, res) => {
    let users = await UserModel.find();
    res.json({ users });
  });

  return router;
}

export default UsersController;