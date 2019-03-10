import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  id: { type: Number, required: true },
  tournament_id: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  results: { type: Schema.Types.ObjectId, ref: 'MatchResult' },
  completed: Boolean,
}, {
  toObject: {virtuals:true},
});

schema.virtual('tournament', {
  ref: 'Tournament',
  localField: 'tournament_id',
  foreignField: 'id',
  justOne: true,
});

export default mongoose.model('Match', schema);
