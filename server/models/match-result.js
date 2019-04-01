import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  id: Number,
  matchId: String,
  resultId: String,
  syncType: { type: String, enum: ['auto', 'manual'] },

  playersResults: [{
    playerId: String,

    results: [{
      rule: { type: Schema.Types.ObjectId, ref: 'Rule' },
      score: { type: Number },
    }],
  }],
},
{
  toObject: { virtuals: true },
}
);

schema.virtual('playersResults.player', {
  ref: 'Player',
  localField: 'playersResults.playerId',
  foreignField: '_id',
  justOne: true,
});

export default mongoose.model('MatchResult', schema);
