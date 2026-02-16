/**
 * Cart Controller — maps HTTP requests to cart service calls.
 * Keeps controller thin; all logic stays in the service layer.
 */

import { Request, Response } from 'express';
import { addToCart, getCart } from '../services/cart.service';

/**
 * POST /cart/add
 * Body: { userId: string, productId: string, quantity: number }
 */
export function handleAddToCart(req: Request, res: Response): void {
    try {
        const { userId, productId, quantity } = req.body;

        // Basic input validation
        if (!userId || !productId || !quantity) {
            res.status(400).json({ error: 'Missing required fields: userId, productId, quantity' });
            return;
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            res.status(400).json({ error: 'Quantity must be a positive number' });
            return;
        }

        const cart = addToCart(userId, productId, quantity);
        res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * GET /cart/:userId
 */
export function handleGetCart(req: Request, res: Response): void {
    try {
        const userId = req.params.userId as string;
        const cart = getCart(userId);
        res.status(200).json(cart);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
