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
    price: {
      type: Number,
      min: 0
    },
    rewards: {
      type: Map,
      of: String
    },
    rules: {
      type: Map,
      of: Number
    },
    isForecastingActive: {
      type: Boolean,
      default: false
    },
    isStarted: {
      type: Boolean,
      default: false
    },
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
    viewers: [
      {
        userId: String,
        summoners: [String]
      }
    ]
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

schema.virtual('isEmpty').get(function () {
  if (isEmpty(this.rules) || isEmpty(this.rewards) || this.matches.length === 0) {
    return true;
  }

  return false;
});

schema.virtual('isApplicationsAvailable').get(function () {
  if (!this.isEmpty && !this.isForecastingActive && !this.isStarted) {
    return true;
  }

  return false;
});

schema.virtual('isFinalized').get(function () {
  return false;
});

export default mongoose.model('Tournament', schema);

