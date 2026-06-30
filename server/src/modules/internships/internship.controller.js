import * as internshipService from './internship.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createInternship = asyncHandler(async (req, res) => {
    const internship = await internshipService.createInternship(req.body);
    ApiResponse.created(res, internship, 'Internship created successfully');
});

export const getUserInternships = asyncHandler(async (req, res) => {
    // Users can view their own, admins/coordinators can view any
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const internships = await internshipService.getUserInternships(targetUserId);
    ApiResponse.success(res, internships);
});

export const getAllInternships = asyncHandler(async (req, res) => {
    const internships = await internshipService.getAllInternships();
    ApiResponse.success(res, internships);
});

export const getInternshipById = asyncHandler(async (req, res) => {
    const internship = await internshipService.getInternshipById(req.params.id);
    ApiResponse.success(res, internship);
});

export const addDailyLog = asyncHandler(async (req, res) => {
    const result = await internshipService.addDailyLog(req.params.id, req.body);
    ApiResponse.success(res, result, 'Daily log added');
});

export const getInternshipLogs = asyncHandler(async (req, res) => {
    const logs = await internshipService.getInternshipLogs(req.params.id);
    ApiResponse.success(res, logs);
});
