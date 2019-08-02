import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const refTo = schemaName => ({ type: Schema.Types.ObjectId, ref: schemaName })

export default mongoose.model('Match',
  new Schema({
    tournamentId: refTo('Tournament'),
    name: String,
    playersResults: [{
      _id: false,
      userId: refTo('User'),
      results: {
        type: Map,
        of: Number
      }
    }],
    isActive: {
      type: Boolean,
      default: false,
    },
    startedAt: Date,
    endAt: Date,
    updatedAt: Date,
  },
    {
      toObject: { virtuals: true },
    }
  ));
