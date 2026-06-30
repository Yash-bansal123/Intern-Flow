import Joi from 'joi';

export const createSprintSchema = Joi.object({
    project_id: Joi.number().integer().required(),
    name: Joi.string().max(255).required(),
    goal: Joi.string().allow('', null),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required().min(Joi.ref('start_date')),
    status: Joi.string().valid('planned', 'active', 'completed').default('planned')
});

export const updateSprintSchema = Joi.object({
    name: Joi.string().max(255),
    goal: Joi.string().allow('', null),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')),
    status: Joi.string().valid('planned', 'active', 'completed')
});
