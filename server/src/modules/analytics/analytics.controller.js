import * as analyticsService from './analytics.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getSystemOverview = asyncHandler(async (req, res) => {
    const stats = await analyticsService.getSystemOverview();
    ApiResponse.success(res, stats);
});

export const getUserAnalytics = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const stats = await analyticsService.getUserAnalytics(targetUserId);
    ApiResponse.success(res, stats);
});

export const getInternProgressAnalytics = asyncHandler(async (req, res) => {
    // Determine the normalized role based on JWT
    const role = (req.user.role || req.user.role_name || '').toLowerCase().replace(' ', '_');
    const data = await analyticsService.getInternProgress(req.user.id, role);
    ApiResponse.success(res, data);
});
