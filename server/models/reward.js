import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('Reward', new Schema({
  key: {
    type: String,
    index: {
      unique: true,
    }
  },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
}));
