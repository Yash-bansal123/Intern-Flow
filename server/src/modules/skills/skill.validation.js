import Joi from 'joi';

export const addUserSkillSchema = Joi.object({
    skill_id: Joi.number().integer().required(),
    current_level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required()
});

export const logSkillProgressSchema = Joi.object({
    user_skill_id: Joi.number().integer().required(),
    previous_level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    new_level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    justification_task_id: Joi.number().integer().allow(null)
});
