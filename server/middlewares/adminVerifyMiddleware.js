import UserModel from '../models/user';

const AdminVerifyMiddleware = (req, res, next) => {
  const isAdmin = req.decoded.isAdmin;

  if (!isAdmin) {
    res.send({ error: 'You are not admin' });
    return;
  }

  next();
}

export default AdminVerifyMiddleware;