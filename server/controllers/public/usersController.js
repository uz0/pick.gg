import express from "express";
import UserModel from "../../models/user";
import TransactionModel from "../../models/transaction";

let router = express.Router();

const PublicUsersController = () => {
  router.get('/', async (req, res) => {
    const users = await UserModel.find().select('-password -balance -summonerName -isAdmin');

    res.json({
      users,
    });
  });

  router.get('/rating', async (req, res) => {
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

export default PublicUsersController;