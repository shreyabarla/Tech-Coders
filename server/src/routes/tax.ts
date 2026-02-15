import express from 'express';
import { calculateTax, getTaxData, updateTaxData } from '../controllers/taxController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/calculate', calculateTax);
router.get('/data', getTaxData);
router.put('/data', updateTaxData);

export default router;
