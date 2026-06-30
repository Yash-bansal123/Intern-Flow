import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';

export const createSprint = async (sprintData) => {
    const { project_id, name, goal, start_date, end_date, status } = sprintData;

    // Check project exists
    const [projects] = await pool.query('SELECT id FROM projects WHERE id = ?', [project_id]);
    if (projects.length === 0) throw ApiError.notFound('Project not found');

    const [result] = await pool.query(
        `INSERT INTO sprints (project_id, name, goal, start_date, end_date, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [project_id, name, goal || null, start_date, end_date, status || 'planned']
    );

    return getSprintById(result.insertId);
};

export const getSprintById = async (id) => {
    const [sprints] = await pool.query('SELECT * FROM sprints WHERE id = ?', [id]);
    if (sprints.length === 0) throw ApiError.notFound('Sprint not found');
    return sprints[0];
};

export const getSprintsByProject = async (projectId) => {
    const [sprints] = await pool.query(
        'SELECT * FROM sprints WHERE project_id = ? ORDER BY start_date ASC', 
        [projectId]
    );
    return sprints;
};

export const updateSprint = async (id, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updateData[key]);
        }
    });

    if (fields.length === 0) return getSprintById(id);

    values.push(id);
    await pool.query(`UPDATE sprints SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return getSprintById(id);
};

export const deleteSprint = async (id) => {
    const [result] = await pool.query('DELETE FROM sprints WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw ApiError.notFound('Sprint not found');
};
