import { Router } from 'express';
import { getAllProducts, getProduct } from '../controllers/index.js';
const router = Router();
router.get('/', getAllProducts);
router.get('/:id', getProduct);
export default router;
