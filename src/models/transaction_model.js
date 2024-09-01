import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  address: { type: String, required: true },
  transactions: [
    {
      hash: { type: String, unique: true, required: true },
      timestamp: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      value: { type: String, required: true },
      gasUsed: { type: String, required: true },
      gasPrice: { type: String, required: true },
    },
  ],
});
const Transaction = mongoose.model('Transaction', transactionSchema);

export { Transaction };
