import express from 'express';
import { getTransactions, createTransaction } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.get('/', getTransactions);
router.post('/', createTransaction);

export default router;
