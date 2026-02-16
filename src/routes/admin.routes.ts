/**
 * Admin Routes — defines admin-only API endpoints.
 */

import { Router } from 'express';
import { handleGenerateDiscount, handleGetStats } from '../controllers/admin.controller';

const router = Router();

router.post('/generate-discount', handleGenerateDiscount);
router.get('/stats', handleGetStats);

export default router;
