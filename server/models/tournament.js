import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refTo = schemaName => ({ type: Schema.Types.ObjectId, ref: schemaName })

const schema = new Schema({
  id: { type: String, unique: true},
  name: String,
  description: String,
  url: String, 
  imageUrl: String,
  createdAt: Date,
  startAt: Date,
  rewards: [{ rewardId: String, rewardPositionId: String }], // во время создания турнира, юзер может указать ID наград (выбрать их из своего инвентаря), после победы, эти награды передаются победителям... каким?
  price: {type: Number, min: 0},
  rules: {
    type: Map,
    of: Number
  }, 
  isReady: {type: Boolean, default: false},
  winner: refTo('User'),
  creatorId: refTo('User'),
  summoners: [refTo('User')],
  applicants: [refTo('User')], 
  viewers: [{ userId: String, summoners: [String] }], 
},
{
  toObject: { virtuals: true },
  toJSON: {virtuals: true}
}
);

schema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'tournament_id'
});

export default mongoose.model('Tournament', schema);