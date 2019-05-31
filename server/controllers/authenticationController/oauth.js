import jwt from "jsonwebtoken";

import UserModel from "../../models/user";

import { ONE_DAY } from './constants'

export default (app) => async (req, res) => {
  const { email, name, photo } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    await UserModel.create({
      username: name,
      photo,
      email,
      password: '',
      isAdmin: false,
      isStreamer: false,
    });
  }
  const { _id, isAdmin, isStreamer, username } = await UserModel.findOne({
    email
  });
  res.json({
    success: true,
    message: 'Enjoy your token!',
    token: jwt.sign({
      _id,
      isAdmin,
      isStreamer,
      username
    }, app.get('superSecret'), {
        expiresIn: ONE_DAY
      })
  });
}