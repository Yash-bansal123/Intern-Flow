import Joi from 'joi';

export const updateUserSchema = Joi.object({
    first_name: Joi.string().max(100),
    last_name: Joi.string().max(100),
    department: Joi.string().max(100).allow('', null),
    college: Joi.string().max(200).allow('', null),
    phone: Joi.string().max(20).allow('', null),
    bio: Joi.string().max(1000).allow('', null),
    github_username: Joi.string().max(100).allow('', null),
    theme_preference: Joi.string().valid('light', 'dark')
});

export const updateRoleSchema = Joi.object({
    role_id: Joi.number().integer().required()
});

export const updateSkillsSchema = Joi.object({
    skills: Joi.array().items(
        Joi.object({
            skill_id: Joi.number().integer().required(),
            current_level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required()
        })
    ).required()
});
