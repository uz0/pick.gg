import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Player', new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  photo: { type: String },
}));
