import express from 'express';
import TransactionModel from '../../models/transaction';
let router = express.Router();

const PublicTransactionsController = () => {
  router.get('/', async (req, res) => {
    const transaction = await TransactionModel.find();
    res.send({
      transaction,
    }) 
  });

  router.get('/history', async (req, res) => {
    const userId = req.decoded._id;
    const history = await TransactionModel.find({ userId }, null, { sort: { date: -1 }});
    res.send({
      history,
    })
  });

  router.get('/winnings/:id', async (req, res) => {
    const userId = req.params.id;
    const winnings = await TransactionModel
      .find({ userId })
      .find({ 'origin': 'tournament winning' })

    res.send({
      winnings,
    })
  });

  return router;
}

export default PublicTransactionsController;