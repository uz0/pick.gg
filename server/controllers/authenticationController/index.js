import express from 'express';

import oauth from './oauth';

const router = express.Router();

const AuthenticationController = (app) => {
  router.post('/oauth', oauth(app));

  return router;
};

export default AuthenticationController;
