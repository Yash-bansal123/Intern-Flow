import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, verifyToken, generateRandomToken } from '../../utils/tokenUtils.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/emailService.js';

export const registerUser = async (userData) => {
    const { first_name, last_name, email, password, role, department, college } = userData;

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        throw ApiError.conflict('Email is already registered');
    }

    const [roleRecord] = await pool.query('SELECT id FROM roles WHERE name = ?', [role]);
    if (roleRecord.length === 0) {
        throw ApiError.badRequest('Invalid role selected');
    }
    const role_id = roleRecord[0].id;

    const password_hash = await bcrypt.hash(password, 12);
    const uuid = uuidv4();
    const email_verified = 0;
    const email_verification_token = generateRandomToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [result] = await pool.query(
        `INSERT INTO users 
         (uuid, first_name, last_name, email, password_hash, role_id, department, college, email_verified, email_verification_token, email_verification_expires) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuid, first_name, last_name, email, password_hash, role_id, department || null, college || null, email_verified, email_verification_token, expires]
    );

    // Send async email
    sendVerificationEmail(email, email_verification_token).catch(console.error);

    return {
        id: result.insertId,
        uuid,
        email,
        message: 'Registration successful. Please check your email to verify your account.'
    };
};

export const loginUser = async (email, password) => {
    const [users] = await pool.query(
        `SELECT u.*, r.name as role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.email = ? AND u.is_active = TRUE`,
        [email]
    );

    if (users.length === 0) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.email_verified) {
        throw ApiError.unauthorized('Please verify your email before logging in');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query('UPDATE users SET refresh_token = ?, last_login = NOW() WHERE id = ?', [refreshToken, user.id]);

    delete user.password_hash;
    delete user.refresh_token;

    return { user, accessToken, refreshToken };
};

export const refreshAuthToken = async (oldRefreshToken) => {
    try {
        const decoded = verifyToken(oldRefreshToken, true);
        
        const [users] = await pool.query(
            `SELECT u.*, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ? AND u.refresh_token = ? AND u.is_active = TRUE`,
            [decoded.id, oldRefreshToken]
        );

        if (users.length === 0) {
            throw new Error();
        }

        const user = users[0];
        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

        delete user.password_hash;
        delete user.refresh_token;

        return { user, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
    }
};

export const logoutUser = async (userId) => {
    await pool.query('UPDATE users SET refresh_token = NULL WHERE id = ?', [userId]);
};

export const verifyEmail = async (token) => {
    const [users] = await pool.query(
        'SELECT id FROM users WHERE email_verification_token = ? AND email_verification_expires > NOW()',
        [token]
    );

    if (users.length === 0) {
        throw ApiError.badRequest('Invalid or expired verification token');
    }

    await pool.query(
        'UPDATE users SET email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL WHERE id = ?',
        [users[0].id]
    );

    return { message: 'Email verified successfully' };
};

export const requestPasswordReset = async (email) => {
    const [users] = await pool.query('SELECT id, email FROM users WHERE email = ? AND is_active = TRUE', [email]);
    
    if (users.length === 0) {
        return; // Don't reveal if user exists
    }

    const token = generateRandomToken();
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await pool.query(
        'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
        [token, expires, users[0].id]
    );

    sendPasswordResetEmail(users[0].email, token).catch(console.error);
};

export const resetPassword = async (token, newPassword) => {
    const [users] = await pool.query(
        'SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
        [token]
    );

    if (users.length === 0) {
        throw ApiError.badRequest('Invalid or expired reset token');
    }

    const password_hash = await bcrypt.hash(newPassword, 12);

    await pool.query(
        'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, refresh_token = NULL WHERE id = ?',
        [password_hash, users[0].id]
    );
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) throw ApiError.notFound('User not found');

    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

    const new_password_hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [new_password_hash, userId]);
};
