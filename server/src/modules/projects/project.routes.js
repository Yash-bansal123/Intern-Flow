import { Router } from 'express';
import * as projectController from './project.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { createProjectSchema, updateProjectSchema, addMemberSchema } from './project.validation.js';

const router = Router();

router.use(requireAuth);

router.post('/', authorize('admin', 'mentor', 'team_lead', 'placement_coordinator'), validate(createProjectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', authorize('admin', 'mentor', 'team_lead', 'placement_coordinator'), validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', authorize('admin', 'mentor'), projectController.deleteProject);

// Member Routes
router.get('/:id/members', projectController.getMembers);
router.post('/:id/members', authorize('admin', 'mentor', 'team_lead', 'placement_coordinator'), validate(addMemberSchema), projectController.addMember);
router.delete('/:id/members/:userId', authorize('admin', 'mentor', 'team_lead', 'placement_coordinator'), projectController.removeMember);

export default router;
