import { Router } from 'express';
import * as taskController from './task.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { createTaskSchema, updateTaskSchema } from './task.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/all', authorize('admin', 'placement_coordinator', 'mentor', 'team_lead'), taskController.getAllTasks);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getUserTasks);
router.get('/project/:projectId', taskController.getProjectTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
