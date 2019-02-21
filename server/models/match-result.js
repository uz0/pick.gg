import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('MatchResult', new Schema({
  matchId: Schema.Types.ObjectId,
  player: { type: Schema.Types.ObjectId, ref: 'Player' },
  rule: { type: Schema.Types.ObjectId, ref: 'Rule' },
  result: Number,
}));
