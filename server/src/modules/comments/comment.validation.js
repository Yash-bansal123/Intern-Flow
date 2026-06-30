import Joi from 'joi';

export const createCommentSchema = Joi.object({
    task_id: Joi.number().integer().required(),
    content: Joi.string().required()
});

export const updateCommentSchema = Joi.object({
    content: Joi.string().required()
});
