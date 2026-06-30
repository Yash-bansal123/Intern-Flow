import { Router } from 'express';
import * as commentController from './comment.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { createCommentSchema, updateCommentSchema } from './comment.validation.js';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createCommentSchema), commentController.createComment);
router.get('/task/:taskId', commentController.getTaskComments);
router.put('/:id', validate(updateCommentSchema), commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

export default router;
