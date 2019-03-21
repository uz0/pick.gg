import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Player', new Schema({
  // id: { type: Number, required: true },
  name: { type: String, required: true },
  photo: { type: String },
}));
