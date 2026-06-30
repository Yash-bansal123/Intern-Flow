import { ApiError } from '../utils/ApiError.js';
import pool from '../config/database.js';

export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(ApiError.unauthorized());
            }

            // Fetch the actual role name from DB if not present in token
            let userRole = req.user.role;
            if (typeof req.user.role === 'number') {
                const [roles] = await pool.query('SELECT name FROM roles WHERE id = ?', [req.user.role]);
                if (roles.length > 0) {
                    userRole = roles[0].name;
                }
            }

            if (!allowedRoles.includes(userRole)) {
                return next(ApiError.forbidden('You do not have permission to perform this action'));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
