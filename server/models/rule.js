import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Rule', new Schema({
  id: { type: Number },
  name: { type: String, required: true },
}));
