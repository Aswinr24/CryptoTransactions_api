import { Transaction } from '../models/transaction_model.js';
import { Price } from '../models/price_model.js';
import { logger } from '../utils/logger.js';

export const fetchExpensesAndPrice = async (req, res) => {
  const address = req.query.address || req.body.address;
  if (!address) {
    return res.status(400).json({ error: 'Ethereum Address is required' });
  }

  try {
    const latestPriceRecord = await Price.findOne().sort({ timestamp: -1 });
    if (!latestPriceRecord) {
      return res.status(500).json({ error: 'Unable to fetch Ethereum price' });
    }
    const currentETHPrice = latestPriceRecord.price;

    let transactionRecord = await Transaction.findOne({ address });
    if (!transactionRecord) {
      return res
        .status(404)
        .json({ error: 'No transactions found for this address' });
    }

    const totalExpenses = transactionRecord.transactions.reduce((total, tx) => {
      if (tx.from.toLowerCase() === address.toLowerCase()) {
        const value = parseFloat(tx.value) / 1e18;
        const gasCost =
          (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18;
        return total + value + gasCost;
      }
      return total;
    }, 0);

    res.json({ totalExpenses, currentETHPrice });
  } catch (error) {
    logger.error('Error fetching expenses and price:', error.message);
    res.status(500).json({ error: 'Failed to fetch expenses and price' });
  }
};
