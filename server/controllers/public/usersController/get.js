import UserModel from '../../../models/user';

export default async (req, res) => {
  const users = await UserModel.find().select('-isAdmin');

  res.json(users);
};
