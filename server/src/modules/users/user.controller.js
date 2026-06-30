import * as userService from './user.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { parsePagination, buildPaginationResponse } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllUsers = asyncHandler(async (req, res) => {
    const { page, limit, offset } = parsePagination(req.query);
    const { role, search } = req.query;

    const { users, total } = await userService.getAllUsers(page, limit, role, search);
    const pagination = buildPaginationResponse(total, page, limit);

    ApiResponse.paginated(res, users, pagination);
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.success(res, user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    // Users can only update their own profile unless admin
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
        throw ApiError.forbidden('You can only update your own profile');
    }

    const updatedUser = await userService.updateUserProfile(req.params.id, req.body);
    ApiResponse.success(res, updatedUser, 'Profile updated successfully');
});

export const uploadAvatar = asyncHandler(async (req, res) => {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
        throw ApiError.forbidden('You can only update your own avatar');
    }

    if (!req.file) {
        throw ApiError.badRequest('No image file provided');
    }

    const result = await userService.uploadAvatar(req.params.id, req.file.buffer);
    ApiResponse.success(res, result, 'Avatar uploaded successfully');
});

export const deactivateUser = asyncHandler(async (req, res) => {
    await userService.deactivateUser(req.params.id);
    ApiResponse.success(res, null, 'User deactivated successfully');
});

export const getUserPortfolio = asyncHandler(async (req, res) => {
    const portfolio = await userService.getUserPortfolioByUuid(req.params.uuid);
    ApiResponse.success(res, portfolio);
});

