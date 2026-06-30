import * as commentService from './comment.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createComment = asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(req.body, req.user.id);
    ApiResponse.created(res, comment, 'Comment added successfully');
});

export const getTaskComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getTaskComments(req.params.taskId);
    ApiResponse.success(res, comments);
});

export const updateComment = asyncHandler(async (req, res) => {
    const comment = await commentService.updateComment(req.params.id, req.user.id, req.body.content);
    ApiResponse.success(res, comment, 'Comment updated successfully');
});

export const deleteComment = asyncHandler(async (req, res) => {
    await commentService.deleteComment(req.params.id, req.user.id, req.user.role);
    ApiResponse.success(res, null, 'Comment deleted successfully');
});
