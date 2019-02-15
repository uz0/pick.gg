import mongoose from "mongoose";
let Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  about: { type: String },
  email: { type: String },
  balance: { type: Number },
  isAdmin : { type: Boolean },
}));