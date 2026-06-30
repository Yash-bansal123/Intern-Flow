import { Router } from 'express';
import * as skillController from './skill.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { addUserSkillSchema, logSkillProgressSchema } from './skill.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/master', skillController.getMasterSkillsList);
router.get('/user/:userId', skillController.getUserSkills);
router.post('/user', validate(addUserSkillSchema), skillController.addUserSkill);
router.post('/progress', validate(logSkillProgressSchema), skillController.updateSkillProgress);

export default router;
