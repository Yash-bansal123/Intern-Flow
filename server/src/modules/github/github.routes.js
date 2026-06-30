import { Router } from 'express';
import * as githubController from './github.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

// Public route (needed for public portfolio view without logging in)
router.get('/user/:uuid', githubController.getUserStats);

// Protected routes (require user to be authenticated)
router.get('/my-stats', requireAuth, githubController.getMyStats);
router.get('/stats/:username', requireAuth, githubController.getStats);

export default router;
