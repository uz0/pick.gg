import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  name        : { type: String, required: true },
  entry       : { type: Number, required: true },
  tournament_id  : { type: Number },

  users       : [{
    _id: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    players_ids: [Number],
  }],

  rules: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Rule' },
    rule: { type: Schema.Types.ObjectId, ref: 'Rule' },
    score: { type: Number },
  }],

  winner: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: {virtuals:true},
});

schema.virtual('tournament', {
  ref: 'Tournament',
  localField: 'tournament_id',
  foreignField: 'id',
  justOne: true,
});

schema.virtual('users.players', {
  ref: 'Player',
  localField: 'users.players_ids',
  foreignField: 'id',
  justOne: false,
});

export default mongoose.model('FantasyTournament', schema);
