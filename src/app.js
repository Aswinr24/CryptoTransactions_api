import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { connectToDatabase } from './services/dbConnect.js';
import { fetchPrice } from './services/priceService.js';
import transactionRoutes from './routes/transactions.js';
import expenseRoutes from './routes/expenses.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());

const port = process.env.PORT || 8080;

connectToDatabase();
setInterval(fetchPrice, 10 * 60 * 1000);

app.use('/api/transactions', transactionRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Crypto Transactions API' });
});

app.listen(port, () => {
  logger.info(`Server running on Port:${port}`);
});
