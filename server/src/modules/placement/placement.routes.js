import { Router } from 'express';
import * as placementController from './placement.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { uploadSingle } from '../../middleware/upload.js';
import { updatePlacementProgressSchema, scheduleMockInterviewSchema, completeMockInterviewSchema } from './placement.validation.js';

const router = Router();

router.use(requireAuth);

router.post('/upload-resume', uploadSingle('resume'), placementController.uploadResume);
router.get('/progress/:userId', placementController.getProgress);
router.put('/progress', validate(updatePlacementProgressSchema), placementController.updateProgress);

router.get('/skills-matrix', authorize('admin', 'super_admin', 'placement_coordinator', 'mentor', 'team_lead', 'hr'), placementController.getSkillsMatrix);
router.get('/top-interns', authorize('admin', 'placement_coordinator', 'mentor', 'super_admin', 'hr', 'team_lead'), placementController.getTopInterns);

router.get('/interviews/:userId', placementController.getUserInterviews);
router.post('/interviews/:userId', authorize('admin', 'super_admin', 'placement_coordinator', 'mentor', 'team_lead', 'hr'), validate(scheduleMockInterviewSchema), placementController.scheduleInterview);
router.put('/interviews/:interviewId', authorize('admin', 'super_admin', 'placement_coordinator', 'mentor', 'team_lead', 'hr'), validate(completeMockInterviewSchema), placementController.completeInterview);

export default router;
