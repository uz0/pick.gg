import mongoose from 'mongoose';
import { regions } from '../../common/constants';
const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    partialFilterExpression: { email: { $type: 'string' } }
  },
  summonerName: { type: String, unique: true },
  imageUrl: { type: String },
  about: { type: String },
  role: { type: String, enum: ['user', 'admin', 'streamer'], default: 'user' },
  regionId: { type: String, enum: [...regions] },
  preferredPosition: { type: String, enum: ['adc', 'mid', 'top', 'jungle', 'supp'] },
},
  {
    toObject: { virtuals: true },
  }
));