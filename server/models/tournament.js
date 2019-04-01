import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  // champions: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  // matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  champions_ids: [String],
  matches_ids: [String],
  syncType: { type: String, enum: ['auto', 'manual'] },
  origin: { type: String, enum: ['escore', 'manual'] },
},
{
  toObject: { virtuals: true },
}
);

schema.virtual('champions', {
  ref: 'Player',
  localField: 'champions_ids',
  foreignField: '_id',
  justOne: false,
});

schema.virtual('matches', {
  ref: 'Match',
  localField: 'matches_ids',
  foreignField: '_id',
  justOne: false,
});

export default mongoose.model('Tournament', schema);