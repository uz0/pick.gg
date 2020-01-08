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
  gameSpecificFields: {
    LOL: {
      displayName: { type: String, default: '' },
      regionId: { type: String, enum: ['', ...REGIONS], default: '' }
    },
    PUBG: {
      displayName: { type: String, default: '' }
    }
  },
  contact: {
    type: String,
    default: ''
  }
},
{
  toObject: { virtuals: true }
}
));
