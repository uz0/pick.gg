import jwt from "jsonwebtoken";

import UserModel from "../../models/user";

import { ONE_DAY } from './constants'

export default (app) => async (req, res) => {
  const { email, name, photo } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    await UserModel.create({
      username: name,
      imageUrl: photo,
      email,
    });
  }

  const { _id, username, isAdmin } = await UserModel.findOne({ email });

  res.json({
    success: true,
    message: 'Enjoy your token!',
    token: jwt.sign({
      _id,
      username,
      isAdmin,
    }, app.get('superSecret'), {
        expiresIn: ONE_DAY
      })
  });
}