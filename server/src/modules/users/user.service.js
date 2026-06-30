import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import cloudinary from '../../config/cloudinary.js';

export const getAllUsers = async (page = 1, limit = 20, role = null, search = null) => {
    const offset = (page - 1) * limit;
    let query = `
        SELECT u.id, u.first_name, u.last_name, u.email, u.department, u.profile_picture_url, 
               u.is_active, r.name as role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE 1=1
    `;
    const params = [];

    if (role) {
        query += ` AND r.name = ?`;
        params.push(role);
    }
    
    if (search) {
        query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
    }

    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM users u JOIN roles r ON u.role_id = r.id WHERE 1=1`;
    const countParams = [];
    if (role) { countQuery += ` AND r.name = ?`; countParams.push(role); }
    if (search) {
        countQuery += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
        const searchParam = `%${search}%`;
        countParams.push(searchParam, searchParam, searchParam);
    }
    const [countResult] = await pool.query(countQuery, countParams);

    return {
        users,
        total: countResult[0].total
    };
};

export const getUserById = async (userId) => {
    const [users] = await pool.query(
        `SELECT u.id, u.uuid, u.first_name, u.last_name, u.email, u.department, u.college, 
                u.profile_picture_url, u.phone, u.bio, u.github_username, u.internship_status, u.created_at, r.name as role_name 
         FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
        [userId]
    );

    if (users.length === 0) throw ApiError.notFound('User not found');
    return users[0];
};

export const updateUserProfile = async (userId, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    });

    if (fields.length === 0) return getUserById(userId);

    values.push(userId);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return getUserById(userId);
};

export const uploadAvatar = async (userId, fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'internflow/avatars',
                public_id: `user_${userId}_avatar`,
                overwrite: true,
                transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }]
            },
            async (error, result) => {
                if (error) return reject(ApiError.internal('Failed to upload image'));
                
                try {
                    await pool.query('UPDATE users SET profile_picture_url = ? WHERE id = ?', [result.secure_url, userId]);
                    resolve({ url: result.secure_url });
                } catch (dbError) {
                    reject(dbError);
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export const deactivateUser = async (userId) => {
    await pool.query('UPDATE users SET is_active = FALSE, refresh_token = NULL WHERE id = ?', [userId]);
};

export const getUserPortfolioByUuid = async (uuid) => {
    // 1. Get user details
    const [users] = await pool.query(
        `SELECT id, uuid, first_name, last_name, email, department, college, profile_picture_url, phone, bio, github_username, created_at 
         FROM users WHERE uuid = ? AND is_active = TRUE`,
        [uuid]
    );
    if (users.length === 0) throw ApiError.notFound('Portfolio not found');
    const user = users[0];

    // 2. Get user skills
    const [skills] = await pool.query(
        `SELECT s.name, us.current_level 
         FROM user_skills us 
         JOIN skills s ON us.skill_id = s.id 
         WHERE us.user_id = ?`,
        [user.id]
    );

    // 3. Get completed tasks
    const [tasks] = await pool.query(
        `SELECT title, description, updated_at as completed_at 
         FROM tasks 
         WHERE assignee_id = ? AND status = 'done' 
         ORDER BY updated_at DESC`,
        [user.id]
    );

    // 4. Get resume contributions
    const [contributions] = await pool.query(
        `SELECT generated_point as contribution_text, created_at 
         FROM resume_contributions 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [user.id]
    );

    return {
        user,
        skills,
        tasks,
        contributions
    };
};

