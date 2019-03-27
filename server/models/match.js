import mongoose from "mongoose";
const Schema = mongoose.Schema;

let schema = new Schema({
  id: { type: Number },
  tournament_id: { type: Number },
  // tournament: { type: Schema.Types.ObjectId, ref: 'tournament' }, // Временное поле для создания матча через админку 
  startDate: { type: Date, required: true },
  resultsId: { type: String },
  // results: { type: Schema.Types.ObjectId, ref: 'MatchResult' },
  completed: Boolean,
  syncAt: {type: Date }
}, 
// {
//   toObject: {virtuals:true},
// }
);

// schema.virtual('tournament', {
//   ref: 'Tournament',
//   localField: 'tournament_id',
//   foreignField: 'id',
//   justOne: true,
// });

export default mongoose.model('Match', schema);
