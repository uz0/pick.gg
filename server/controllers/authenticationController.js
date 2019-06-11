import express from "express";
import UserModel from "../models/user";
import jwt from "jsonwebtoken";
import passwordHash from "password-hash";

let router = express.Router();

const AuthenticationController = (app) => {
  router.post("/oauth", async (req, res) => {
    const { email, name, photo } = req.body;

    let user = await UserModel.findOne({ email });

    if(!user){
      await UserModel.create({
        username: name,
        photo,
        email,
        password: '',
        isAdmin: false,
        isStreamer: false,
      });
    }

    user = await UserModel.findOne({ email }, { password: 0 });

    const payload = {
      _id: user._id,
      isAdmin: user.isAdmin, // WARNING! security vulnerability attention!
      isStreamer: user.isStreamer, // WARNING! security vulnerability attention!
      username: user.username
    };

    let token = jwt.sign(payload, app.get("superSecret"), {
      expiresIn : 60 * 60 * 24 // expires in 24 hours
    });

    res.json({
      success: true,
      message: "Enjoy your token!",
      user,
      token,
    });
  });

  router.post("/authenticate", async (req, res) => {
    let username = req.body.username.toLowerCase(); // Workaround: temporary fix of Case insensetive username
    let password = req.body.password;
    let user = await UserModel.findOne({ username });

    if (!user) {
      res.json({
        success: false,
        message: "Authentication failed. User not found."
      });
    } else if (user) {
      if (!passwordHash.verify(password, user.password)) {
        res.json({
          success: false,
          message: "Authentication failed. Wrong password."
        });
      } else {
        const payload = {
          _id: user._id,
          isAdmin: user.isAdmin, // WARNING! security vulnerability attention!
          isStreamer: user.isStreamer, // WARNING! security vulnerability attention!
          username: user.username
        };

        let token = jwt.sign(payload, app.get("superSecret"), {
          expiresIn : 60 * 60 * 24 // expires in 24 hours
        });

        res.json({
          success: true,
          message: "Enjoy your token!",
          token,
        });
      }
    }
  });

  router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    let message = '';

    if (!username) {
      message = 'Enter username';
    }

    if (!password) {
      message = 'Enter password';
    }

    if (!email) {
      message = 'Enter email';
    }

    if (message) {
      res.json({
        success: false,
        message,
      });

      return;
    }

    try {
      const hash = passwordHash.generate(password);

      const user = await UserModel.create({
        username,
        email,
        password: hash,
        isAdmin: false,
      });

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      let message = '';

      if (error.code === 11000) {
        message = 'User already exist';
      } else {
        message = 'Error while register';
      }

      res.json({
        success: false,
        message,
      });
    }
  });

  return router;
};

export default AuthenticationController;
