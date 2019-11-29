import mongoose from 'mongoose';
import { REGIONS } from '../../common/constants';
const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    partialFilterExpression: { email: { $type: 'string' } }
  },
  imageUrl: { type: String, default: '' },
  about: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  canProvideTournaments: { type: Boolean, default: false },
  twitchAccount: { type: String, default: '' },
  gameSpecificName: {
    type: Map,
    of: String,
    default: {},
  },
  contact: {
    type: String,
    default: ''
  },
  regionId: { type: String, enum: ['', ...REGIONS], default: '' },
  preferredPosition: { type: String, enum: ['', 'adc', 'mid', 'top', 'jungle', 'support'], default: '' },
},
  {
    toObject: { virtuals: true },
  }
));