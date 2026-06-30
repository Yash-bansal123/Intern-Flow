import Joi from 'joi';

export const createInternshipSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    mentor_id: Joi.number().integer().allow(null),
    title: Joi.string().max(200).required(),
    company: Joi.string().max(200).default('InternFlow internal'),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required().min(Joi.ref('start_date'))
});

export const logActivitySchema = Joi.object({
    log_date: Joi.date().iso().required(),
    activities: Joi.string().required(),
    challenges: Joi.string().allow('', null),
    learnings: Joi.string().allow('', null),
    hours_logged: Joi.number().min(0).max(24).default(8.00)
});
