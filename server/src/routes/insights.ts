import express from 'express';
import { getPatterns, getPredictions, getRecommendations } from '../controllers/insightsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/patterns', getPatterns);
router.get('/predictions', getPredictions);
router.get('/recommendations', getRecommendations);

export default router;
