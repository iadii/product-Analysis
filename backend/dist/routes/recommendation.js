import { Router } from 'express';
import { getRecommendations, getQuickRecommendations, getCacheStats } from '../controllers/index.js';
const router = Router();
router.post('/', getRecommendations);
router.get('/quick/:productId', getQuickRecommendations);
router.get('/cache/stats', getCacheStats);
export default router;
