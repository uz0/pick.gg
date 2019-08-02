import express from 'express';
import getRating from './getRating';

let router = express.Router();

const PublicRatingController = () => {
  router.get('/', getRating);

  return router;
};

export default PublicRatingController;