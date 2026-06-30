import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(422, errorMessage));
    }
    
    return next();
};
