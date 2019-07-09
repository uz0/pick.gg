import jwt from "jsonwebtoken";

import UserModel from "../../models/user";

import { ONE_DAY } from './constants'

export default (app) => async (req, res) => {
  const { email, name, photo } = req.body;
  const checkUser = await UserModel.findOne({ email });

  if (!checkUser) {
    await UserModel.create({
      username: name,
      imageUrl: photo,
      email,
    });
  }

  const user = await UserModel.findOne({ email });

  const { _id, username, isAdmin } = user;

  res.json({
    success: true,
    message: 'Enjoy your token!',
    user,
    token: jwt.sign({
      _id,
      username,
      isAdmin,
    }, app.get('superSecret'), {
        expiresIn: ONE_DAY
      })
  });
}