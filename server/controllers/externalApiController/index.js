import express from 'express';

import getLastMatchesByName from './pubg/lastMatchesByName';
import getMatch from './pubg/matchById';

const router = express.Router();

const ExternalApiContoller = io => {
  router.get('/pubg/lastMatches/:nickname', getLastMatchesByName);

  router.get('/pubg/match/:id', getMatch);

  return router;
};

export default ExternalApiContoller;
