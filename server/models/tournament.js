import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('Tournament', new Schema({
  tournamentId: { type: Number, required: true },
  name        : { type: String, required: true },
  date        : { type: Date, required: true },
  entry       : { type: Number, required: true },

  users       : [{
    _id: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
  }],

  rules: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Rule' },
    rule: { type: Schema.Types.ObjectId, ref: 'Rule' },
    score: { type: Number },
  }],

  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],

}));