import Joi from 'joi';

export const createTaskSchema = Joi.object({
    project_id: Joi.number().integer().required(),
    sprint_id: Joi.number().integer().allow(null),
    title: Joi.string().max(255).required(),
    description: Joi.string().allow('', null),
    type: Joi.string().valid('feature', 'bug', 'learning', 'infrastructure').default('feature'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    status: Joi.string().valid('todo', 'in_progress', 'in_review', 'done').default('todo'),
    assignee_id: Joi.number().integer().allow(null),
    story_points: Joi.number().integer().min(0).allow(null),
    due_date: Joi.date().iso().allow(null)
});

export const updateTaskSchema = Joi.object({
    sprint_id: Joi.number().integer().allow(null),
    title: Joi.string().max(255),
    description: Joi.string().allow('', null),
    type: Joi.string().valid('feature', 'bug', 'learning', 'infrastructure'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    status: Joi.string().valid('todo', 'in_progress', 'in_review', 'done'),
    assignee_id: Joi.number().integer().allow(null),
    story_points: Joi.number().integer().min(0).allow(null),
    due_date: Joi.date().iso().allow(null)
});
