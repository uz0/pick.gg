import express from 'express';
import UserModel from '../../models/user';

const router = express.Router();

const PublicUsersController = () => {
  router.get('/', async (req, res) => {
    const users = await UserModel.find().select('-isAdmin');

    res.json({
      users
    });
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findOne({ _id: id });

    res.json({ user });
  });

  return router;
};

export default PublicUsersController;
