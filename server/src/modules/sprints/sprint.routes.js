import { Router } from 'express';
import * as sprintController from './sprint.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { createSprintSchema, updateSprintSchema } from './sprint.validation.js';

const router = Router({ mergeParams: true }); // Enable accessing projectId from parent router

router.use(requireAuth);

// Note: Mounted under /projects/:projectId/sprints OR directly /sprints depending on use-case
// We'll support direct /sprints operations for update/delete, and nested for create/get

router.post('/', authorize('admin', 'mentor', 'team_lead'), validate(createSprintSchema), sprintController.createSprint);
router.get('/project/:projectId', sprintController.getProjectSprints);
router.get('/:id', sprintController.getSprintById);
router.put('/:id', authorize('admin', 'mentor', 'team_lead'), validate(updateSprintSchema), sprintController.updateSprint);
router.delete('/:id', authorize('admin', 'mentor'), sprintController.deleteSprint);

export default router;
