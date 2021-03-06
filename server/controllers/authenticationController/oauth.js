import jwt from 'jsonwebtoken';

import UserModel from '../../models/user';

import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import { ONE_DAY } from './constants';

export default (app) => async (req, res) => {
  const { email, name, photo, contact, gameSpecificFields } = req.body;

  const [specEmail] = email.split('@');

  const userInfo = {
    name,
    email,
    contact,
    gameSpecificFields,
    imageUrl: photo,
    username: specEmail
  };

  const user = await UserModel.findOneAndUpdate({ email }, omitBy(userInfo, isNil), {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  });

  const { _id, username, isAdmin } = user;

  res.json({
    success: true,
    message: 'Enjoy your token!',
    user,
    token: jwt.sign({
      _id,
      username,
      isAdmin
    }, app.get('superSecret'), {
      expiresIn: ONE_DAY
    })
  });
};
