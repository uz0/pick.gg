import express from 'express';

import getLastMatchByName from './pubg/lastMatchByName';

const router = express.Router();

const ExternalApiContoller = io => {
  router.get('/pubg/lastMatch/:nickname', getLastMatchByName);

  return router;
};

export default ExternalApiContoller;
