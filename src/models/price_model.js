import mongoose from 'mongoose'

const priceSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  price: { type: Number, required: true },
})

const Price = mongoose.model('Price', priceSchema)

export { Price }
