import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';

export const generateContribution = async (userId, data) => {
    const { task_id, action_verb, impact_metric } = data;

    // Verify task exists and is assigned to user
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [task_id]);
    if (tasks.length === 0) throw ApiError.notFound('Task not found');
    const task = tasks[0];

    // Simple AI-like generation logic (in real-world, call OpenAI here)
    const generatedText = `${action_verb} ${task.title.toLowerCase()} ${impact_metric ? `resulting in ${impact_metric}` : ''}.`;

    const [result] = await pool.query(
        `INSERT INTO resume_contributions (user_id, task_id, project_id, original_title, generated_point)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, task_id, task.project_id, task.title, generatedText]
    );

    return { id: result.insertId, contribution_text: generatedText };
};

export const generateAllContributions = async (userId) => {
    // Fetch all completed tasks for the user that do not yet have a resume contribution
    const [tasks] = await pool.query(
        `SELECT t.* 
         FROM tasks t 
         LEFT JOIN resume_contributions r ON t.id = r.task_id AND r.user_id = t.assignee_id
         WHERE t.assignee_id = ? AND t.status = 'done' AND r.id IS NULL`,
        [userId]
    );

    if (tasks.length === 0) {
        return { message: 'No new completed tasks to generate contributions for.', generatedCount: 0 };
    }

    const newContributions = [];
    for (const task of tasks) {
        let actionVerb = 'Completed';
        if (task.task_type === 'feature') actionVerb = 'Developed';
        if (task.task_type === 'bug') actionVerb = 'Resolved';
        if (task.task_type === 'documentation') actionVerb = 'Documented';

        const generatedText = `${actionVerb} ${task.title.toLowerCase()} to improve system efficiency and user experience.`;
        
        await pool.query(
            `INSERT INTO resume_contributions (user_id, task_id, project_id, original_title, generated_point)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, task.id, task.project_id, task.title, generatedText]
        );
        newContributions.push({ task_id: task.id, contribution_text: generatedText });
    }

    return { message: 'Generated new contributions', generatedCount: newContributions.length, newContributions };
};

export const getUserContributions = async (userId) => {
    const [contributions] = await pool.query(
        `SELECT r.id, r.user_id, r.task_id, r.project_id, r.internship_id, r.original_title, r.generated_point as contribution_text, r.is_approved, r.is_included, r.created_at, t.title as task_title, p.name as project_name
         FROM resume_contributions r
         JOIN tasks t ON r.task_id = t.id
         JOIN projects p ON r.project_id = p.id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC`,
        [userId]
    );
    return contributions;
};

export const updateContribution = async (id, userId, text) => {
    // verify ownership
    const [existing] = await pool.query('SELECT user_id FROM resume_contributions WHERE id = ?', [id]);
    if (existing.length === 0) throw ApiError.notFound('Contribution not found');
    if (existing[0].user_id !== userId) throw ApiError.forbidden('Cannot edit another users contribution');

    await pool.query('UPDATE resume_contributions SET generated_point = ? WHERE id = ?', [text, id]);
    return { message: 'Contribution updated' };
};

export const deleteContribution = async (id, userId) => {
    const [existing] = await pool.query('SELECT user_id FROM resume_contributions WHERE id = ?', [id]);
    if (existing.length === 0) throw ApiError.notFound('Contribution not found');
    if (existing[0].user_id !== userId) throw ApiError.forbidden('Cannot delete another users contribution');

    await pool.query('DELETE FROM resume_contributions WHERE id = ?', [id]);
    return { message: 'Contribution deleted' };
};
