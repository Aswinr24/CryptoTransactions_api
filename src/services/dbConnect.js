import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();
const mongoURI = process.env.MONGO_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB Atlas');
  } catch (error) {
    logger.error('Failed to connect to MongoDB Atlas', error);
  }
};

export { connectToDatabase };
