import { Router } from 'express';
import { fetchAndStoreTransactions } from '../controllers/transactionController.js';

const router = Router();

router.get('/', fetchAndStoreTransactions);

export default router;
