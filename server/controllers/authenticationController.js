import express from "express";
import UserModel from "../models/user";
import jwt from "jsonwebtoken";
import passwordHash from "password-hash";

let router = express.Router();

const AuthenticationController = (app) => {
  router.post("/authenticate", async (req, res) => {
    let username = req.body.username;
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
          isAdmin: user.isAdmin,
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
    const confirmPassword = req.body.confirmPassword;

    let message = '';

    if (!username) {
      message = 'Enter username';
    }

    if (!password) {
      message = 'Enter password';
    }

    if (!confirmPassword) {
      message = 'Enter confirm password';
    }

    if (message) {
      res.json({
        success: false,
        message,
      });

      return;
    }

    if (password !== confirmPassword) {
      res.json({
        success: false,
        message: 'Passwords is not equal',
      });

      return;
    }

    try {
      const user = await UserModel.create({ username, password: passwordHash.generate(password), isAdmin: false });

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.json({
        success: false,
        message: 'User already exist',
      });
    }
  });

  return router;
};

export default AuthenticationController;
