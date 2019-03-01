import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('FantasyTournament', new Schema({

  tournament  : { type: Schema.Types.ObjectId, ref: 'Tournament' },
  name        : { type: String, required: true },
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

  winner: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  
}));
