import dotenv from 'dotenv';
dotenv.config();

export default {
  secret: process.env.SECRET,
  database: process.env.DATABASE,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
}