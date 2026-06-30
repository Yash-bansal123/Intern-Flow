import { Router } from 'express';
import * as resumeController from './resume.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { generateContributionSchema, updateContributionSchema } from './resume.validation.js';

const router = Router();

router.use(requireAuth);

router.post('/generate', validate(generateContributionSchema), resumeController.generateContribution);
router.post('/generate-all', resumeController.generateAllContributions);
router.get('/user/:userId', resumeController.getContributions);
router.put('/:id', validate(updateContributionSchema), resumeController.updateContribution);
router.delete('/:id', resumeController.deleteContribution);

export default router;
