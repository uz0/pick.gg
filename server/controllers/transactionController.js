import express from "express";
import TransactionModel from "../models/transaction";
import UserModel from "../models/user";
let router = express.Router();

const TransactionController = () => {

  router.get('/', async (req, res) => {
    let transaction = await TransactionModel.find();
    res.send({
      transaction,
    }) 
  });

  router.get('/history', async (req, res) => {
    const userId = req.decoded._id;
    let history = await TransactionModel.find({ userId });
    res.send({
      history,
    })
  });

  router.post('/deposit', async (req, res) => {
    const userId = req.decoded._id;
    const fields = {
      amount: req.body.amount,
      operation: req.body.operation,
      origin: req.body.origin,
    }

    await UserModel.findByIdAndUpdate({ _id: userId }, {$inc :{ balance: fields.amount }});
    await TransactionModel.create({
      userId,
      amount: fields.amount,
      operation: fields.operation,
      origin: fields.origin,
      date: Date.now(),
    });

    res.send({
      userId,
      amount: fields.amount,
      operation: fields.operation,
      origin: fields.origin,
      date: Date.now(),
    });

    return router;
  });
  
  router.post('/withdraw', async (req, res) => {

    const userId = req.decoded._id;
    const fields = {
      amount: -req.body.amount,
      operation: req.body.operation,
      origin: req.body.origin,
    }

    await UserModel.findByIdAndUpdate({ _id: userId }, {$inc :{ balance: fields.amount }});
    await TransactionModel.create({
      userId,
      amount: fields.amount,
      operation: fields.operation,
      origin: fields.origin,
      date: Date.now(),
    });

    res.send({
      userId,
      amount: fields.amount,
      operation: fields.operation,
      origin: fields.origin,
      date: Date.now(),
    });

    return router;

  });

  return router;
}

export default TransactionController;