import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Player', new Schema({
  name: { type: String, required: true },
  photo: { type: String },
}));
