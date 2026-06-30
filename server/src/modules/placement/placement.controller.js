import * as placementService from './placement.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import fs from 'fs';
import path from 'path';

export const getProgress = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const progress = await placementService.getPlacementProgress(targetUserId);
    ApiResponse.success(res, progress);
});

export const updateProgress = asyncHandler(async (req, res) => {
    const progress = await placementService.updatePlacementProgress(req.user.id, req.body);
    ApiResponse.success(res, progress, 'Placement progress updated');
});

export const getUserInterviews = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const interviews = await placementService.getMockInterviews(targetUserId);
    ApiResponse.success(res, interviews);
});

export const scheduleInterview = asyncHandler(async (req, res) => {
    // Usually scheduled by coordinator or mentor for a student
    const result = await placementService.scheduleMockInterview(req.params.userId, req.body);
    ApiResponse.created(res, result);
});

export const completeInterview = asyncHandler(async (req, res) => {
    const result = await placementService.completeMockInterview(req.params.interviewId, req.body);
    ApiResponse.success(res, result);
});

export const getSkillsMatrix = asyncHandler(async (req, res) => {
    const matrix = await placementService.getInternSkillsMatrix();
    ApiResponse.success(res, matrix);
});

export const getTopInterns = asyncHandler(async (req, res) => {
    const topInterns = await placementService.getTopInterns();
    ApiResponse.success(res, topInterns);
});

export const uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('No file provided');
    }

    const uploadsDir = path.resolve(process.cwd(), 'uploads/resumes');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a safe, unique filename
    const ext = path.extname(req.file.originalname) || '.pdf';
    const filename = `resume_user_${req.user.id}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    // Construct public relative URL
    const publicUrl = `/uploads/resumes/${filename}`;

    const result = await placementService.saveUploadedResumeUrl(req.user.id, publicUrl);
    ApiResponse.success(res, result, 'Resume uploaded successfully');
});

