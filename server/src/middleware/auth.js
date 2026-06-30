import { verifyToken } from '../utils/tokenUtils.js';
import { ApiError } from '../utils/ApiError.js';
import pool from '../config/database.js';

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Access token is missing or invalid');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // Optional: Check if user still exists/is active
        const [users] = await pool.query(
            'SELECT id, email, role_id, is_active FROM users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0 || !users[0].is_active) {
            throw ApiError.unauthorized('User no longer exists or is deactivated');
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(ApiError.unauthorized('Token expired'));
        } else {
            next(ApiError.unauthorized('Invalid token'));
        }
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            req.user = verifyToken(token);
        }
        next();
    } catch (error) {
        // Just proceed without setting req.user
        next();
    }
};
