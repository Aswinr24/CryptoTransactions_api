import axios from 'axios'
import { Price } from '../models/price_model.js'

export const fetchPrice = async () => {
  const url = 'https://api.coingecko.com/api/v3/simple/price'
  const params = {
    ids: 'ethereum',
    vs_currencies: 'inr',
  }

  try {
    const response = await axios.get(url, { params })
    const price = response.data.ethereum.inr
    await Price.create({
      price,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Error fetching Ethereum price:', error.message)
  }
}
