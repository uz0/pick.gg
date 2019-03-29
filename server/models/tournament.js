import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  // champions: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  // matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  champions_ids: [Number],
  matches_ids: [Number],
},
{
  toObject: {virtuals:true},
}
);

schema.virtual('champions', {
  ref: 'Player',
  localField: 'champions_ids',
  foreignField: 'id',
  justOne: false,
});

schema.virtual('matches', {
  ref: 'Match',
  localField: 'matches_ids',
  foreignField: 'id',
  justOne: false,
});

export default mongoose.model('Tournament', schema);