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
    let user = await UserModel.findOne({ _id: userId });
    res.json({ user });
  });

  router.post('/me', async (req, res) => {
    const userId = req.decoded._id;
    const fields = {
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
    let transactions = await TransactionModel.aggregate([
      {
        $group: {
          _id: '$userId',
          amount: { $first: '$amount' },
          origin: { $first: '$origin' },
          date: { $first: '$date' },

          total: {
            $sum: {
              $cond: [
                {
                  '$gt': ['$amount', 0],
                },

                "$amount",
                0,
              ]
            }
          },
        },
      },

      {
        $sort: { total: -1 }
      },

      {
        $lookup: {from: 'users', localField: '_id', foreignField: '_id', as: 'user'}
      },

      { '$unwind': '$user' },

      {
        '$project': {
          userId: 1,
          origin: 1,
          date: 1,
          total: 1,
          'user._id': 1,
          'user.username': 1,
        }
      },
    ])

    res.send({ transactions });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    let user = await UserModel.findOne({ _id: id });
    res.json({ user });
  });

  return router;
}

export default UsersController;