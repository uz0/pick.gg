import express from "express";
import UserModel from "../models/user";
import TransactionModel from "../models/transaction";
let router = express.Router();

const UsersController = () => {
  router.get('/', async (req, res) => {
    let users = await UserModel.find();
    res.json({ users });
  });

  router.get('/me', async (req, res) => {
    const userId = req.decoded._id;
    let user = await UserModel.findOne({ _id: userId }, '_id username balance isAdmin about email');
    res.json({ user });
  });

  router.post('/me', async (req, res) => {
    const userId = req.decoded._id;
    const fields = {
      username: req.body.username,
      email: req.body.email,
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
          transactions: 0
        }
      }
    ])

    const rating = [...usersWithWinnings, ...users];

    res.send({ rating });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    let user = await UserModel.findOne({ _id: id });
    res.json({ user });
  });

  return router;
}

export default UsersController;