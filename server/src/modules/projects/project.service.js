import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import slugify from 'slugify';

export const createProject = async (projectData) => {
    const { name, description, status, start_date, end_date, created_by } = projectData;
    
    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    
    const [result] = await pool.query(
        `INSERT INTO projects (name, description, slug, status, start_date, end_date, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, slug, status || 'planning', start_date || null, end_date || null, created_by || null]
    );

    return getProjectById(result.insertId);
};

export const getProjectById = async (id) => {
    const [projects] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projects.length === 0) throw ApiError.notFound('Project not found');
    return projects[0];
};

export const getAllProjects = async (page = 1, limit = 20, userId = null) => {
    const offset = (page - 1) * limit;
    
    let query = `SELECT * FROM projects p`;
    let countQuery = `SELECT COUNT(*) as total FROM projects p`;
    const params = [];
    
    // If a user ID is provided, fetch projects where the user is a member or admin
    if (userId) {
        query = `
            SELECT p.* FROM projects p 
            JOIN project_members pm ON p.id = pm.project_id 
            WHERE pm.user_id = ?
        `;
        countQuery = `
            SELECT COUNT(*) as total FROM projects p 
            JOIN project_members pm ON p.id = pm.project_id 
            WHERE pm.user_id = ?
        `;
        params.push(userId);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [projects] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, params.slice(0, userId ? 1 : 0));

    return { projects, total: countResult[0].total };
};

export const updateProject = async (id, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    });

    if (fields.length === 0) return getProjectById(id);

    values.push(id);
    await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return getProjectById(id);
};

export const deleteProject = async (id) => {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw ApiError.notFound('Project not found');
};

// --- Project Members ---

export const getProjectMembers = async (projectId) => {
    const [members] = await pool.query(
        `SELECT pm.id, pm.user_id, pm.role, pm.joined_at, 
                u.first_name, u.last_name, u.email, u.profile_picture_url 
         FROM project_members pm
         JOIN users u ON pm.user_id = u.id
         WHERE pm.project_id = ?`,
        [projectId]
    );
    return members;
};

export const addProjectMember = async (projectId, userId, role) => {
    // Ensure user exists
    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) throw ApiError.notFound('User not found');

    try {
        await pool.query(
            `INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)`,
            [projectId, userId, role]
        );
        return getProjectMembers(projectId);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') throw ApiError.conflict('User is already a member of this project');
        throw error;
    }
};

export const removeProjectMember = async (projectId, userId) => {
    await pool.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [projectId, userId]);
};
