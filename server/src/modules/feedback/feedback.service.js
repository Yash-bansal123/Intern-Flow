import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';

export const addMentorFeedback = async (mentorId, feedbackData) => {
    const { internship_id, task_id, feedback_type, rating, comments, areas_for_improvement } = feedbackData;

    // Ensure mentor is actually assigned to this internship (optional but good security)
    const [internships] = await pool.query('SELECT mentor_id FROM internships WHERE id = ?', [internship_id]);
    if (internships.length === 0) throw ApiError.notFound('Internship not found');
    if (internships[0].mentor_id !== mentorId) throw ApiError.forbidden('You are not the mentor for this internship');

    const [result] = await pool.query(
        `INSERT INTO mentor_feedback (internship_id, mentor_id, task_id, feedback_type, rating, comments, areas_for_improvement)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [internship_id, mentorId, task_id || null, feedback_type, rating || null, comments, areas_for_improvement || null]
    );

    return { id: result.insertId, message: 'Feedback submitted successfully' };
};

export const getInternshipFeedback = async (internshipId) => {
    const [feedback] = await pool.query(
        `SELECT f.*, t.title as task_title 
         FROM mentor_feedback f
         LEFT JOIN tasks t ON f.task_id = t.id
         WHERE f.internship_id = ?
         ORDER BY f.created_at DESC`,
        [internshipId]
    );
    return feedback;
};

export const addWeeklyEvaluation = async (evaluatorId, evaluationData) => {
    const { internship_id, week_number, technical_score, soft_skills_score, overall_score, feedback } = evaluationData;

    try {
        const [result] = await pool.query(
            `INSERT INTO weekly_evaluations (internship_id, week_number, evaluator_id, technical_score, soft_skills_score, overall_score, feedback)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [internship_id, week_number, evaluatorId, technical_score, soft_skills_score, overall_score, feedback]
        );
        return { id: result.insertId, message: 'Weekly evaluation saved' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') throw ApiError.conflict('An evaluation for this week already exists');
        throw error;
    }
};

export const getWeeklyEvaluations = async (internshipId) => {
    const [evaluations] = await pool.query(
        'SELECT * FROM weekly_evaluations WHERE internship_id = ? ORDER BY week_number ASC',
        [internshipId]
    );
    return evaluations;
};
