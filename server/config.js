import dotenv from 'dotenv';
dotenv.config();

export default {
  pubg: {
    apiKey: process.env.PUBG_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNmEyMDQwMC1mZmQ0LTAxMzctNTg0Ni0xNTY5OGE1NTgzYjciLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTc2MjQwOTgyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im92Y2hpbmd1cy1nbWFpIn0.i-ZLR8F6WM3rnXlTOQLRCCzA5qt9dAiF9T1woicHxu8',
    apiRegion: 'pc-na'
  },
  secret: process.env.SECRET || 'sdfmn43lkfvmsd',
  database: process.env.MONGODB_URI || 'mongodb://admin:admin@ds121248.mlab.com:21248/react-app',
  options: {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
};
