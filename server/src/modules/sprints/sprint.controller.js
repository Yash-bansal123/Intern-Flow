import * as sprintService from './sprint.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createSprint = asyncHandler(async (req, res) => {
    const sprint = await sprintService.createSprint(req.body);
    ApiResponse.created(res, sprint, 'Sprint created successfully');
});

export const getProjectSprints = asyncHandler(async (req, res) => {
    const sprints = await sprintService.getSprintsByProject(req.params.projectId);
    ApiResponse.success(res, sprints);
});

export const getSprintById = asyncHandler(async (req, res) => {
    const sprint = await sprintService.getSprintById(req.params.id);
    ApiResponse.success(res, sprint);
});

export const updateSprint = asyncHandler(async (req, res) => {
    const sprint = await sprintService.updateSprint(req.params.id, req.body);
    ApiResponse.success(res, sprint, 'Sprint updated successfully');
});

export const deleteSprint = asyncHandler(async (req, res) => {
    await sprintService.deleteSprint(req.params.id);
    ApiResponse.success(res, null, 'Sprint deleted successfully');
});
