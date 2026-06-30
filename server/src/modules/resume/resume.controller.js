import * as resumeService from './resume.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const generateContribution = asyncHandler(async (req, res) => {
    const result = await resumeService.generateContribution(req.user.id, req.body);
    ApiResponse.created(res, result);
});

export const generateAllContributions = asyncHandler(async (req, res) => {
    const result = await resumeService.generateAllContributions(req.user.id);
    ApiResponse.success(res, result);
});

export const getContributions = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const contributions = await resumeService.getUserContributions(targetUserId);
    ApiResponse.success(res, contributions);
});

export const updateContribution = asyncHandler(async (req, res) => {
    const result = await resumeService.updateContribution(req.params.id, req.user.id, req.body.contribution_text);
    ApiResponse.success(res, result);
});

export const deleteContribution = asyncHandler(async (req, res) => {
    await resumeService.deleteContribution(req.params.id, req.user.id);
    ApiResponse.success(res, null, 'Contribution deleted');
});
