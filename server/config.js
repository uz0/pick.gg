import dotenv from 'dotenv';
dotenv.config();

export default {
  secret: process.env.SECRET || 'sdfmn43lkfvmsd',
  database: process.env.MONGODB_URI || 'mongodb://admin:admin@ds121248.mlab.com:21248/react-app',
  options: {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
}

