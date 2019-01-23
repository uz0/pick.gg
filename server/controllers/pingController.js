import express from "express";
let router = express.Router();

const PingController = () => {
  router.get('/', (req, res) => {
    res.json({message: 'Hello from express!'})
  });

  return router;
}

export default PingController;