import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  id: { type: Number },
  tournament_id: { type: Number },
  // tournament: { type: Schema.Types.ObjectId, ref: 'tournament' }, // Временное поле для создания матча через админку 
  startDate: { type: Date },
  resultsId: { type: String },
  // results: { type: Schema.Types.ObjectId, ref: 'MatchResult' },
  completed: Boolean,
  syncAt: {type: Date }
}, 
{
  toObject: {virtuals:true},
}
);

schema.virtual('results', {
  ref: 'MatchResult',
  localField: 'resultsId',
  foreignField: '_id',
  justOne: true,
});

export default mongoose.model('Match', schema);
