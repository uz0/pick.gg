import express from "express";
import RuleModel from "../../models/rule";

let router = express.Router();

const PublicRulesController = () => {
  router.get('/', async (req, res) => {
    const rules = await RuleModel.find();
    res.json({ rules });
  });

  return router;
}

export default PublicRulesController;