import * as taskService from './task.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body, req.user.id);
    ApiResponse.created(res, task, 'Task created successfully');
});

export const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { sprintId, backlog } = req.query;
    
    let targetSprintId = undefined;
    if (backlog === 'true') targetSprintId = null;
    else if (sprintId) targetSprintId = sprintId;

    const tasks = await taskService.getTasksByProject(req.params.projectId, targetSprintId);
    ApiResponse.success(res, tasks);
});

export const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getAllTasks();
    ApiResponse.success(res, tasks);
});

export const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    ApiResponse.success(res, task);
});

export const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    ApiResponse.success(res, task, 'Task updated successfully');
});

export const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    ApiResponse.success(res, null, 'Task deleted successfully');
});

export const getUserTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasksByUser(req.user.id);
    ApiResponse.success(res, tasks);
});
