import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllSkillsList = async () => {
    const [skills] = await pool.query('SELECT * FROM skills ORDER BY category, name');
    return skills;
};

export const getUserSkills = async (userId) => {
    const [skills] = await pool.query(
        `SELECT us.id as user_skill_id, us.current_level, us.is_verified, s.id as skill_id, s.name, s.category
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [userId]
    );
    return skills;
};

export const addUserSkill = async (userId, skillId, initialLevel) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO user_skills (user_id, skill_id, current_level) VALUES (?, ?, ?)',
            [userId, skillId, initialLevel]
        );
        return { user_skill_id: result.insertId, message: 'Skill added' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') throw ApiError.conflict('You already have this skill tracked');
        throw error;
    }
};

export const updateSkillProgress = async (userId, userSkillId, newLevel, previousLevel, taskId = null) => {
    // verify ownership
    const [us] = await pool.query('SELECT user_id FROM user_skills WHERE id = ?', [userSkillId]);
    if (us.length === 0) throw ApiError.notFound('Skill tracking record not found');
    if (us[0].user_id !== userId) throw ApiError.forbidden('Cannot modify another users skills');

    await pool.query('UPDATE user_skills SET current_level = ? WHERE id = ?', [newLevel, userSkillId]);
    
    const notes = taskId ? `Auto-updated via task completion (Task ID: ${taskId})` : 'Self assessment update';
    await pool.query(
        'INSERT INTO skill_progress (user_skill_id, previous_level, new_level, notes) VALUES (?, ?, ?, ?)',
        [userSkillId, previousLevel, newLevel, notes]
    );

    return { message: 'Skill level updated successfully' };
};
