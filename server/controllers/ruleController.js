import express from "express";
import RuleModel from "../models/rule";

let router = express.Router();

const RuleController = () => {
  router.get('/', async (req, res) => {
    let rules = await RuleModel.find();
    res.json({ rules });
  });

  return router;
}

export default RuleController;