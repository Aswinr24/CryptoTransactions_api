import axios from 'axios';
import { Transaction } from '../models/transaction_model.js';
import { logger } from '../utils/logger.js';

const apiKey = process.env.ETHERSCAN_API_KEY;

export const fetchAndStoreTransactions = async (req, res) => {
  const address = req.body.address;
  if (!address) {
    return res.status(400).json({ error: 'Ethereum Address is required' });
  }

  const url = 'https://api.etherscan.io/api';
  const params = {
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: 0,
    endblock: 99999999,
    page: 1,
    offset: 10,
    sort: 'asc',
    apikey: apiKey,
  };

  try {
    const response = await axios.get(url, { params });

    if (response.data.status !== '1') {
      throw new Error(`Etherscan API Error: ${response.data.message}`);
    }

    const transactions = response.data.result;
    const processedTransactions = transactions.map((tx) => ({
      ...tx,
      timestamp: String(tx.timeStamp),
    }));

    let transactionRecord = await Transaction.findOne({ address });
    if (transactionRecord) {
      const existingHashes = new Set(
        transactionRecord.transactions.map((tx) => tx.hash)
      );
      const newTransactions = processedTransactions.filter(
        (tx) => !existingHashes.has(tx.hash)
      );
      if (newTransactions.length > 0) {
        transactionRecord.transactions.push(...newTransactions);
        await transactionRecord.save();
      }
    } else {
      transactionRecord = new Transaction({
        address,
        transactions: processedTransactions,
      });
      await transactionRecord.save();
    }

    res.json({ transactions: processedTransactions });
  } catch (error) {
    logger.error('Error fetching transaction list:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
