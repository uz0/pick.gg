import mongoose from "mongoose";
let Schema = mongoose.Schema;

export default mongoose.model('Transactions', new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  operation: { type: String, enum: ['deposit', 'withdraw'], required: true },
  date: { type: Date, required: true }
}));