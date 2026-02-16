/**
 * Cart Routes — defines cart-related API endpoints.
 */

import { Router } from 'express';
import { handleAddToCart, handleGetCart } from '../controllers/cart.controller';

const router = Router();

router.post('/add', handleAddToCart);
router.get('/:userId', handleGetCart);

export default router;
