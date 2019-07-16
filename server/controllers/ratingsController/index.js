import express from 'express';
import getRating from './getRating';

let router = express.Router();

const RatingsController = () => {
  router.get('/', getRating);

  return router;
};

export default RatingsController;