import * as feedbackService from './feedback.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const addFeedback = asyncHandler(async (req, res) => {
    const result = await feedbackService.addMentorFeedback(req.user.id, req.body);
    ApiResponse.created(res, result);
});

export const getFeedback = asyncHandler(async (req, res) => {
    const feedback = await feedbackService.getInternshipFeedback(req.params.internshipId);
    ApiResponse.success(res, feedback);
});

export const addWeeklyEvaluation = asyncHandler(async (req, res) => {
    const result = await feedbackService.addWeeklyEvaluation(req.user.id, req.body);
    ApiResponse.created(res, result);
});

export const getEvaluations = asyncHandler(async (req, res) => {
    const evals = await feedbackService.getWeeklyEvaluations(req.params.internshipId);
    ApiResponse.success(res, evals);
});
