import express from "express";
import UserModel from "../models/user";
import TransactionModel from "../models/transaction";
import riotFetch from '../riotFetch';

import isEmpty from 'lodash/isEmpty';

let router = express.Router();

const UsersController = () => {
  router.get('/', async (req, res) => {
    const users = await UserModel.find();
    res.json({ users });
  });

  router.get('/me', async (req, res) => {
    if (isEmpty(req.decoded)) {
      res.send({
        user: null,
      })

      return;
    }

    const userId = req.decoded._id;
    const user = await UserModel.findOne({ _id: userId }).select('-password');
    res.json({ user });
  });

  router.post('/me', async (req, res) => {
    const userId = req.decoded._id;

    const { username, email, photo, about, summonerName } = req.body;

    let streamerAccountId = '';

    // if (summonerName != ''){
    //   let accountInfo = await riotFetch(`/lol/summoner/v4/summoners/by-name/${summonerName}`);
    //   accountInfo = await accountInfo.json();

    //   if (accountInfo.status && accountInfo.status.status_code === 404){
    //     res.send({
    //       success: false,
    //       error: 'user_not_found',
    //     });

    //     return;
    //   }

    //   streamerAccountId = accountInfo.accountId;
    // }

    const fields = {
      email,
      photo,
      about,
      username,
      summonerName,
      streamerAccountId
    }

    const updatedUser = await UserModel
      .findOneAndUpdate({ _id: userId }, fields)
      .select('-password');

    res.json({
      success: true,
      user: updatedUser,
    });
  });

  router.get('/rating', async (req, res) => {

    // let usersWithWinnings = [];
    const usersWithWinnings = await TransactionModel.aggregate([
      { 
        $match: { origin: 'tournament winning' },
      },
      {
        $group: { _id: "$userId", winning: { $sum: '$amount' } },
      },
      {
        $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          winning: 1,
          'username': '$user.username',
          'photo': '$user.photo',
        }
      },
      {
        $sort: {
          winning: -1,
        }
      },
    ])

    const users = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          username: 1,
          photo: 1,
        }
      },
      {
        $lookup: { from: 'transactions', localField: '_id', foreignField: 'userId', as: 'transactions' }
      },
      {
        $addFields: {
          winning: 0,
        }
      },
      {
        $match: { $expr: {$eq: [{$size: "$transactions"}, 0]} }
      },
      {
        $project: {
          transactions: 0,
        }
      }
    ])

    const rating = [...usersWithWinnings, ...users];

    res.send({ rating });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findOne({ _id: id });

    res.json({ user });
  });

  return router;
}

export default UsersController;