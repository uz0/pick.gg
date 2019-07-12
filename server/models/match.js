import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const refTo = schemaName => ({ type: Schema.Types.ObjectId, ref: schemaName })

export default mongoose.model('Match',
  new Schema({
    tournamentId: refTo('Tournament'),
    name: String,
    playersResults: [{
      userId: refTo('User'),
      results: [{
        ruleId: String,
        value: Number
      }]
    }],
    isActive: Boolean,
    startedAt: Date,
    endAt: Date,
    updatedAt: Date,
  },
    {
      toObject: { virtuals: true },
    }
  ));
