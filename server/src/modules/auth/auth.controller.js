import * as authService from './auth.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import pool from '../../config/database.js';

export const register = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);
    ApiResponse.created(res, result);
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    ApiResponse.success(res, result, 'Login successful');
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAuthToken(refreshToken);
    ApiResponse.success(res, result, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user.id);
    ApiResponse.success(res, null, 'Logged out successfully');
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    ApiResponse.success(res, result);
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    ApiResponse.success(res, null, 'If that email exists, a password reset link has been sent.');
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    ApiResponse.success(res, null, 'Password has been reset successfully.');
});

export const getMe = asyncHandler(async (req, res) => {
    const [users] = await pool.query(
        `SELECT u.id, u.uuid, u.first_name, u.last_name, u.email, u.department, u.college, u.profile_picture_url, 
                u.phone, u.bio, u.github_username, u.internship_status, u.theme_preference, u.created_at, r.name as role_name 
         FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
        [req.user.id]
    );
    
    if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    ApiResponse.success(res, users[0]);
});

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    ApiResponse.success(res, null, 'Password updated successfully');
});
