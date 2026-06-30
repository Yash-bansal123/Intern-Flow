import { Router } from 'express';
import * as feedbackController from './feedback.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { addMentorFeedbackSchema, addWeeklyEvaluationSchema } from './feedback.validation.js';

const router = Router();

router.use(requireAuth);

router.post('/mentor', authorize('mentor', 'admin'), validate(addMentorFeedbackSchema), feedbackController.addFeedback);
router.get('/internship/:internshipId/mentor', feedbackController.getFeedback);

router.post('/weekly', authorize('mentor', 'team_lead', 'admin'), validate(addWeeklyEvaluationSchema), feedbackController.addWeeklyEvaluation);
router.get('/internship/:internshipId/weekly', feedbackController.getEvaluations);

export default router;
