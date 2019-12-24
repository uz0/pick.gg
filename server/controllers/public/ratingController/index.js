import express from 'express';
import getRating from './getRating';

const router = express.Router();

const PublicRatingController = () => {
  router.get('/', getRating);

  return router;
};

export default PublicRatingController;
