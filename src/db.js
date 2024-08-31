import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const mongoURI = process.env.MONGO_URI

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log('Connected to MongoDB Atlas')
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error)
  }
}

export { connectToDatabase }
