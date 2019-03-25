import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  matchId: Number,
  match_id: { type: Schema.Types.ObjectId, ref: 'Match' },

  playersResults: [{
    playerId: Number,
    player_id: { type: Schema.Types.ObjectId, ref: 'Player' },

    results: [{
      rule: { type: Schema.Types.ObjectId, ref: 'Rule' },
      score: { type: Number },
    }],
  }],
}, {
  toObject: {virtuals:true},
});

schema.virtual('playersResults.player', {
  ref: 'Player',
  localField: 'playersResults.playerId',
  foreignField: 'id',
  justOne: true,
});

export default mongoose.model('MatchResult', schema);
