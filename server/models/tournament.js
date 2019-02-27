import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Tournament', new Schema({
  name        : { type: String, required: true },
  date        : { type: Date, required: true },

  champions: [], // It means real cyber sportsmen

  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
}));