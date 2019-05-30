import passwordHash from "password-hash";
import jwt from "jsonwebtoken";

import UserModel from '../../models/user';

import { ONE_DAY } from './constants'

export default async (req, res) => {
  const user = await UserModel.findOne({ username: req.body.username.toLowerCase() });// Workaround: temporary fix of Case insensetive username
  if (!user) {
    res.json({
      success: false,
      message: 'Authentication failed. User not found.'
    });
    return;
  }
  if (!passwordHash.verify(req.body.password, user.password)) {
    res.json({
      success: false,
      message: 'Authentication failed. Wrong password.'
    });
    return;
  }
  const payload = {
    _id: user._id,
    isAdmin: user.isAdmin,
    isStreamer: user.isStreamer,
    username: user.username
  };
  const token = jwt.sign(payload, app.get('superSecret'), {
    expiresIn: ONE_DAY // expires in 24 hours
  });
  res.json({
    success: true,
    message: 'Enjoy your token!',
    token
  });
};
