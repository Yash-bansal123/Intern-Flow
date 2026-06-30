import { Router } from 'express';
import * as analyticsController from './analytics.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router();

router.use(requireAuth);

router.get('/overview', authorize('admin', 'super_admin', 'placement_coordinator', 'mentor', 'team_lead', 'hr'), analyticsController.getSystemOverview);
router.get('/intern-progress', authorize('admin', 'super_admin', 'placement_coordinator', 'mentor', 'team_lead', 'hr'), analyticsController.getInternProgressAnalytics);
router.get('/user/:userId', analyticsController.getUserAnalytics);

export default router;
