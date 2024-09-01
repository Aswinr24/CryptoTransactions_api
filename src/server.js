import dotenv from 'dotenv'
import axios from 'axios'
import express from 'express'
import { Transaction } from './models/transaction_model.js'
import { connectToDatabase } from './db.js'
import { fetchPrice } from './services/priceService.js'
import { Price } from './models/price_model.js'

dotenv.config()

const app = express()

app.use(express.json())

const port = process.env.PORT || 8080
const apiKey = process.env.ETHERSCAN_API_KEY

connectToDatabase()
setInterval(fetchPrice, 10 * 60 * 1000)

app.get('/transactions', async (req, res) => {
  const address = req.body.address
  if (!address) {
    return res.status(400).json({ error: 'Ethereum Address is required' })
  }
  const url = 'https://api.etherscan.io/api'
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
  }

  try {
    const response = await axios.get(url, { params })

    if (response.data.status !== '1') {
      throw new Error(`Etherscan API Error: ${response.data.message}`)
    }
    const transactions = response.data.result
    const processedTransactions = transactions.map((tx) => ({
      ...tx,
      timestamp: String(tx.timeStamp),
    }))

    let transactionRecord = await Transaction.findOne({ address })
    if (transactionRecord) {
      const existingHashes = new Set(
        transactionRecord.transactions.map((tx) => tx.hash)
      )
      const newTransactions = processedTransactions.filter(
        (tx) => !existingHashes.has(tx.hash)
      )
      if (newTransactions.length > 0) {
        transactionRecord.transactions.push(...newTransactions)
        await transactionRecord.save()
      }
    } else {
      transactionRecord = new Transaction({
        address,
        transactions: processedTransactions,
      })
      await transactionRecord.save()
    }
    res.json({ transactions: processedTransactions })
  } catch (error) {
    console.error('Error fetching transaction list:', error.message)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

app.get('/expenses', async (req, res) => {
  const address = req.body.address
  if (!address) {
    return res.status(400).json({ error: 'Ethereum Address is required' })
  }
  try {
    const latestPriceRecord = await Price.findOne().sort({ timestamp: -1 })
    if (!latestPriceRecord) {
      return res.status(500).json({ error: 'Unable to fetch Ethereum price' })
    }
    const currentETHPrice = latestPriceRecord.price

    let transactionRecord = await Transaction.findOne({ address })
    if (!transactionRecord) {
      return res
        .status(404)
        .json({ error: 'No transactions found for this address' })
    }

    const totalExpenses = transactionRecord.transactions.reduce((total, tx) => {
      const value = parseFloat(tx.value) / 1e18
      const gasCost = (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18
      return total + value + gasCost
    }, 0)

    res.json({ totalExpenses, currentETHPrice })
  } catch (error) {
    console.error('Error fetching expenses and price:', error.message)
    res.status(500).json({ error: 'Failed to fetch expenses and price' })
  }
})

app.listen(port, () => {
  console.log(`Server running on Port:${port}`)
})
