import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: 'Too many requests, please try again later.'
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per windowMs for auth endpoints
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: 'Too many login attempts, please try again later.'
    }
});
