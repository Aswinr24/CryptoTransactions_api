import { Router } from 'express';
import { fetchExpensesAndPrice } from '../controllers/expenseController.js';

const router = Router();

router.get('/', fetchExpensesAndPrice);

export default router;
