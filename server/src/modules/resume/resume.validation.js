import Joi from 'joi';

export const generateContributionSchema = Joi.object({
    task_id: Joi.number().integer().required(),
    action_verb: Joi.string().required(),
    impact_metric: Joi.string().allow('', null)
});

export const updateContributionSchema = Joi.object({
    contribution_text: Joi.string().required()
});
