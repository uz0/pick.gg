import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Tournament', new Schema({
  name        : { type: String, required: true },
  date        : { type: Date, required: true },

  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],

}));
