import http from "http";
import path from "path";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import socketIO from "socket.io";
import jwt from "jsonwebtoken";
import logger from "morgan";
import bodyParser from "body-parser";

import {
  HomeController,
  UsersController,
  PingController,
  AuthenticationController,
  TournamentController,
  TransactionController,
  RuleController,
  PlayerController,
  SystemController,
  AdminController,
} from "./controllers";

import { AuthVerifyMiddleware, AdminVerifyMiddleware } from "./middlewares";
import config from "./config";

const app = express();
let server = http.Server(app);
server.timeout = 999999;
let io = socketIO(server);

mongoose.Promise = Promise;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") console.log("PRODUCTION");
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use('/api/authentication', AuthenticationController(app));

app.use('/api', AuthVerifyMiddleware(app));
app.use("/api/home", HomeController(io));
app.use("/api/ping", PingController());
app.use("/api/users", UsersController());
app.use("/api/rules", RuleController());
app.use("/api/players", PlayerController());
app.use("/api/tournaments", TournamentController(io));
app.use("/api/transactions", TransactionController());
app.use("/api/system", SystemController());
app.use("/api/admin", AdminVerifyMiddleware, AdminController());

// express will serve up index.html if it doesn't recognize the route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));