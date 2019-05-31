import express from "express";

import reset from './reset';
import deleteById from './deleteById';
import getTournaments from "./getTournaments";
import sync from './sync';
import finalize from './finalize'
import config from "../config";

let router = express.Router();

const SystemController = () => {

  router.get('/reset', reset)

  router.get('/sync', sync);

  router.get('/delete/:id', deleteById)

  router.get('/finalize', finalize);

  router.get('/tournaments', getTournaments);

  router.get('/createmock', createMock)

  return router;
}

export default SystemController