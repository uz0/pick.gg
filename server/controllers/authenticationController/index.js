import express from "express";

import oauth from './oauth';
import register from './register';
import authenticate from './authenticate';

let router = express.Router();

const AuthenticationController = (app) => {
  router.post("/oauth", oauth(app));

  router.post("/authenticate", authenticate);

  router.post("/register", register);

  return router;
};

export default AuthenticationController;
