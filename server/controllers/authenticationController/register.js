import UserModel from "../models/user";

export default async (req, res) => {
  const { username, password, email } = req.body;
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
  }
  catch (error) {
    res.json({
      success: false,
      message: error.code === 11000 ? 'User already exist' : 'Error while register',
    });
  }
}