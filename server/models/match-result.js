import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('MatchResult', new Schema({
  matchId: Number,
  playersResults: [],
}));
