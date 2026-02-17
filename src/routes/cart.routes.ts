/**
 * Cart Routes — defines cart-related API endpoints.
 */

import { Router } from 'express';
import { handleAddToCart, handleGetCart, handleRemoveFromCart } from '../controllers/cart.controller';

const router = Router();

router.post('/add', handleAddToCart);
router.post('/remove', handleRemoveFromCart);
router.get('/:userId', handleGetCart);

export default router;
