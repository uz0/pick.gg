import mongoose from 'mongoose';
import isEmpty from 'lodash/isEmpty';

const Schema = mongoose.Schema;

const refTo = schemaName => ({ type: Schema.Types.ObjectId, ref: schemaName });

const schema = new Schema(
  {
    name: String,
    description: String,
    url: String,
    imageUrl: String,
    createdAt: Date,
    startAt: Date,
    price: { type: Number, min: 0 },
    rewards: {
      type: Map,
      of: String
    },
    rules: {
      type: Map,
      of: Number
    },
    isReady: { type: Boolean, default: false },
    winner: refTo('User'),
    creator: refTo('User'),
    summoners: [refTo('User')],
    applicants: [
      {
        user: refTo('User'),
        status: {
          type: String,
          enum: ['PENDING', 'REJECTED', 'ACCEPTED'],
          default: 'PENDING'
        }
      }
    ],
    viewers: [{ userId: String, summoners: [String] }]
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

schema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'tournamentId'
});

schema.virtual('isPrepared').get(function () {
  if(isEmpty(this.rules) || isEmpty(this.matches)){
    return false;
  }

  if(this.summoners.length < 2){
    return false;
  }

  return true;
});

export default mongoose.model('Tournament', schema);

