import express from "express";
import TransactionModel from "../models/transaction";
let router = express.Router();

const TransactionController = () => {

  router.get('/', async (req, res) => {});

  return router;
}

export default TransactionController;