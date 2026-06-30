import Joi from 'joi';

export const addMentorFeedbackSchema = Joi.object({
    internship_id: Joi.number().integer().required(),
    task_id: Joi.number().integer().allow(null),
    feedback_type: Joi.string().valid('task', 'general', 'milestone').required(),
    rating: Joi.number().integer().min(1).max(5).allow(null),
    comments: Joi.string().required(),
    areas_for_improvement: Joi.string().allow('', null)
});

export const addWeeklyEvaluationSchema = Joi.object({
    internship_id: Joi.number().integer().required(),
    week_number: Joi.number().integer().min(1).required(),
    technical_score: Joi.number().integer().min(0).max(10).required(),
    soft_skills_score: Joi.number().integer().min(0).max(10).required(),
    overall_score: Joi.number().integer().min(0).max(10).required(),
    feedback: Joi.string().required()
});
