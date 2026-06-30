import Joi from 'joi';

export const createProjectSchema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed').default('planning'),
    start_date: Joi.date().iso().allow(null),
    end_date: Joi.date().iso().allow(null).min(Joi.ref('start_date'))
});

export const updateProjectSchema = Joi.object({
    name: Joi.string().max(255),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed'),
    start_date: Joi.date().iso().allow(null),
    end_date: Joi.date().iso().allow(null).min(Joi.ref('start_date'))
});

export const addMemberSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    role_in_project: Joi.string().valid('manager', 'developer', 'designer', 'qa').required()
});
