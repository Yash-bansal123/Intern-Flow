import Joi from 'joi';

export const registerSchema = Joi.object({
    first_name: Joi.string().max(100).required().label('First Name'),
    last_name: Joi.string().max(100).required().label('Last Name'),
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().min(8).required().label('Password'),
    role: Joi.string().valid('admin', 'mentor', 'student', 'team_lead', 'placement_coordinator').required().label('Role'),
    department: Joi.string().max(100).allow('', null).label('Department'),
    college: Joi.string().max(200).allow('', null).label('College')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().required().label('Password')
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().label('Email Address')
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().label('Token'),
    password: Joi.string().min(8).required().label('Password')
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().label('Refresh Token')
});
