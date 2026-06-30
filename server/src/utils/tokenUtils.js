import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT } from '../config/constants.js';

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role_name || user.role_id, uuid: user.uuid },
        process.env.JWT_SECRET,
        { expiresIn: JWT.ACCESS_EXPIRES_IN }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: JWT.REFRESH_EXPIRES_IN }
    );
};

export const verifyToken = (token, isRefresh = false) => {
    const secret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
};

export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
};
