import express from 'express';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../controllers/investmentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getInvestments);
router.post('/', createInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

export default router;
