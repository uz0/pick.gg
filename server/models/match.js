import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Match', new Schema({
  tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  results: { type: Schema.Types.ObjectId, ref: 'MatchResult' },
  completed: Boolean,
}));
