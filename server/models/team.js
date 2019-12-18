import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('Team', new Schema({
  tournamentId: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
  },

  name: { type: String, required: true },
  color: { type: String, required: true },

  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
},
  {
    toObject: { virtuals: true },
  }
));