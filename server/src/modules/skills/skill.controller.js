import * as skillService from './skill.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getMasterSkillsList = asyncHandler(async (req, res) => {
    const skills = await skillService.getAllSkillsList();
    ApiResponse.success(res, skills);
});

export const getUserSkills = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const skills = await skillService.getUserSkills(targetUserId);
    ApiResponse.success(res, skills);
});

export const addUserSkill = asyncHandler(async (req, res) => {
    const { skill_id, current_level } = req.body;
    const result = await skillService.addUserSkill(req.user.id, skill_id, current_level);
    ApiResponse.created(res, result);
});

export const updateSkillProgress = asyncHandler(async (req, res) => {
    const { user_skill_id, previous_level, new_level, justification_task_id } = req.body;
    const result = await skillService.updateSkillProgress(req.user.id, user_skill_id, new_level, previous_level, justification_task_id);
    ApiResponse.success(res, result);
});
