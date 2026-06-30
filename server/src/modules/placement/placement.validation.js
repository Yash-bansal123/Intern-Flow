import Joi from 'joi';

export const updatePlacementProgressSchema = Joi.object({
    dsa_easy_count: Joi.number().integer().min(0),
    dsa_medium_count: Joi.number().integer().min(0),
    dsa_hard_count: Joi.number().integer().min(0),
    leetcode_profile_url: Joi.string().uri().allow('', null)
});

export const scheduleMockInterviewSchema = Joi.object({
    interviewer_id: Joi.number().integer().required(),
    interview_type: Joi.string().valid('technical', 'hr', 'system_design').required(),
    scheduled_at: Joi.date().iso().required(),
    status: Joi.string().valid('scheduled', 'completed', 'cancelled').default('scheduled')
});

export const completeMockInterviewSchema = Joi.object({
    status: Joi.string().valid('completed', 'cancelled').required(),
    feedback: Joi.string().allow('', null),
    score: Joi.number().integer().min(0).max(100).allow(null)
});
