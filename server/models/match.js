import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Match', new Schema({
  date: { type: Date, required: true },
  completed: Boolean,
  results: [{ type: Schema.Types.ObjectId, ref: 'MatchResult' }],
}));
