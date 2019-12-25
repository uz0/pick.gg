import UserModel from '../../../models/user';

export default async (req, res) => {
  const { username } = req.params;
  const regexp = new RegExp('^' + username);

  if (username === '') {
    res.json({
      users: []
    });

    return;
  }

  const users = await UserModel
    .find({ username: { $regex: regexp, $options: 'i' } })
    .select('-password');

  res.json({
    users
  });
};
