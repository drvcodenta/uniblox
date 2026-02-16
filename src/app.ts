/**
 * Express application setup.
 * Configures middleware and mounts route groups.
 * Separated from server.ts so tests can import the app without starting the server.
 */

import express from 'express';
import cors from 'cors';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Health check ---
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes will be mounted here in Phase 2 & 3

export default app;
