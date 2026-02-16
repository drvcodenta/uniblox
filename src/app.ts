/**
 * Express application setup.
 * Configures middleware and mounts route groups.
 * Separated from server.ts so tests can import the app without starting the server.
 */

import express from 'express';
import cors from 'cors';
import cartRoutes from './routes/cart.routes';
import checkoutRoutes from './routes/checkout.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Health check ---
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- API Routes ---
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/admin', adminRoutes);

export default app;
