import express from 'express';

let router = express.Router();

const PublicController = () => {
  router.get('/', (req, res) => {
    res.json({ message: 'Hello from public api!' })
  });

  return router;
}

export default PublicController;