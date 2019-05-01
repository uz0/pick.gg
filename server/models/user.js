import mongoose from "mongoose";
let Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  about: {
    type: String
  },
  photo: {
    type: String
  },

  email: {
    type: String, trim: true, index: {
      unique: true,
      partialFilterExpression: {email: {$type: 'string'}}
    }
  },

  balance: { type: Number },
  isAdmin : { type: Boolean },
  isStreamer : { type: Boolean },
  summonerName: { type: String },
}));