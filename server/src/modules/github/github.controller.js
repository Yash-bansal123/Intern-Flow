import * as githubService from './github.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import pool from '../../config/database.js';

export const getStats = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
        throw ApiError.badRequest('GitHub username is required');
    }
    const stats = await githubService.getGitHubStats(username);
    ApiResponse.success(res, stats);
});

export const getMyStats = asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT github_username FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0 || !rows[0].github_username) {
        return ApiResponse.success(res, null, 'No GitHub account linked');
    }
    const stats = await githubService.getGitHubStats(rows[0].github_username);
    ApiResponse.success(res, stats);
});

export const getUserStats = asyncHandler(async (req, res) => {
    const { uuid } = req.params;
    const [rows] = await pool.query('SELECT github_username FROM users WHERE uuid = ?', [uuid]);
    if (rows.length === 0 || !rows[0].github_username) {
        return ApiResponse.success(res, null, 'No GitHub account linked');
    }
    const stats = await githubService.getGitHubStats(rows[0].github_username);
    ApiResponse.success(res, stats);
});
