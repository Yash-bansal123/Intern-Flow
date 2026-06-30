import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const errorHandler = (err, req, res, next) => {
    console.error('💥 Unhandled Error:', err);
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false, err.stack);
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };

    res.status(error.statusCode).json(response);
};
