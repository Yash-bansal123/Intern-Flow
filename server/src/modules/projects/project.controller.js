import * as projectService from './project.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { parsePagination, buildPaginationResponse } from '../../utils/pagination.js';

export const createProject = asyncHandler(async (req, res) => {
    const project = await projectService.createProject({ ...req.body, created_by: req.user.id });
    ApiResponse.created(res, project, 'Project created successfully');
});

export const getProjects = asyncHandler(async (req, res) => {
    const { page, limit } = parsePagination(req.query);
    // Admins, mentors, team_leads, and coordinators see all projects; students only see their own
    const staffRoles = ['admin', 'placement_coordinator', 'mentor', 'team_lead'];
    const userId = staffRoles.includes(req.user.role) ? null : req.user.id;
    
    const { projects, total } = await projectService.getAllProjects(page, limit, userId);
    const pagination = buildPaginationResponse(total, page, limit);

    ApiResponse.paginated(res, projects, pagination);
});

export const getProjectById = asyncHandler(async (req, res) => {
    const project = await projectService.getProjectById(req.params.id);
    const members = await projectService.getProjectMembers(req.params.id);
    ApiResponse.success(res, { ...project, members });
});

export const updateProject = asyncHandler(async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.body);
    ApiResponse.success(res, project, 'Project updated successfully');
});

export const deleteProject = asyncHandler(async (req, res) => {
    await projectService.deleteProject(req.params.id);
    ApiResponse.success(res, null, 'Project deleted successfully');
});

export const getMembers = asyncHandler(async (req, res) => {
    const members = await projectService.getProjectMembers(req.params.id);
    ApiResponse.success(res, members);
});

export const addMember = asyncHandler(async (req, res) => {
    const { user_id, role_in_project } = req.body;
    const members = await projectService.addProjectMember(req.params.id, user_id, role_in_project);
    ApiResponse.success(res, members, 'Member added successfully');
});

export const removeMember = asyncHandler(async (req, res) => {
    await projectService.removeProjectMember(req.params.id, req.params.userId);
    ApiResponse.success(res, null, 'Member removed successfully');
});
