import { Router } from 'express';
import * as userController from './user.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { uploadSingle } from '../../middleware/upload.js';
import { updateUserSchema } from './user.validation.js';

const router = Router();

// Public routes
router.get('/portfolio/:uuid', userController.getUserPortfolio);

// All user routes require authentication
router.use(requireAuth);

router.get('/', authorize('admin', 'mentor', 'placement_coordinator', 'team_lead'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateProfile);
router.post('/:id/avatar', uploadSingle('avatar'), userController.uploadAvatar);
router.delete('/:id', authorize('admin'), userController.deactivateUser);

export default router;
