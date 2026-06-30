import { Router } from 'express';
import * as internshipController from './internship.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { createInternshipSchema, logActivitySchema } from './internship.validation.js';

const router = Router();

router.use(requireAuth);

router.post('/', authorize('admin', 'super_admin', 'placement_coordinator'), validate(createInternshipSchema), internshipController.createInternship);
router.get('/all', authorize('admin', 'super_admin', 'mentor', 'placement_coordinator', 'team_lead', 'hr'), internshipController.getAllInternships);
router.get('/user/:userId', internshipController.getUserInternships);
router.get('/:id', internshipController.getInternshipById);

// Logs
router.post('/:id/logs', validate(logActivitySchema), internshipController.addDailyLog);
router.get('/:id/logs', internshipController.getInternshipLogs);

export default router;
