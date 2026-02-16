/**
 * Checkout Routes — defines checkout API endpoint.
 */

import { Router } from 'express';
import { handleCheckout } from '../controllers/checkout.controller';

const router = Router();

router.post('/', handleCheckout);

export default router;
