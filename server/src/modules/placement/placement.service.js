import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';

export const getPlacementProgress = async (userId) => {
    let [progress] = await pool.query('SELECT * FROM placement_progress WHERE user_id = ?', [userId]);
    
    // If no progress record exists, create an empty one
    if (progress.length === 0) {
        await pool.query('INSERT IGNORE INTO placement_progress (user_id) VALUES (?)', [userId]);
        [progress] = await pool.query('SELECT * FROM placement_progress WHERE user_id = ?', [userId]);
    }
    
    return progress[0];
};

export const updatePlacementProgress = async (userId, data) => {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }
    });

    if (fields.length === 0) return getPlacementProgress(userId);

    // Ensure record exists
    await getPlacementProgress(userId);

    values.push(userId);
    await pool.query(`UPDATE placement_progress SET ${fields.join(', ')} WHERE user_id = ?`, values);
    
    return getPlacementProgress(userId);
};

// --- Mock Interviews ---

export const getMockInterviews = async (userId) => {
    const [interviews] = await pool.query(
        `SELECT m.*, u.first_name as interviewer_first_name, u.last_name as interviewer_last_name
         FROM mock_interviews m
         JOIN users u ON m.interviewer_id = u.id
         WHERE m.user_id = ?
         ORDER BY m.interview_date DESC`,
        [userId]
    );
    return interviews;
};

export const scheduleMockInterview = async (studentId, data) => {
    const { interviewer_id, type, interview_type, interview_date, scheduled_at, status } = data;
    
    const resolvedType = type || interview_type;
    const resolvedDate = interview_date || scheduled_at;

    const [result] = await pool.query(
        `INSERT INTO mock_interviews (user_id, interviewer_id, type, interview_date, status)
         VALUES (?, ?, ?, ?, ?)`,
        [studentId, interviewer_id, resolvedType, resolvedDate, status || 'scheduled']
    );

    return { id: result.insertId, message: 'Interview scheduled successfully' };
};

export const completeMockInterview = async (interviewId, data) => {
    const { status, feedback, overall_feedback, score, strengths, improvements } = data;
    
    const resolvedFeedback = overall_feedback || feedback || null;

    const [result] = await pool.query(
        'UPDATE mock_interviews SET status = ?, overall_feedback = ?, score = ?, strengths = ?, improvements = ? WHERE id = ?',
        [status, resolvedFeedback, score || null, strengths || null, improvements || null, interviewId]
    );

    if (result.affectedRows === 0) throw ApiError.notFound('Interview not found');
    return { message: 'Interview updated successfully' };
};

// --- Skills Matrix ---
export const getInternSkillsMatrix = async () => {
    const [interns] = await pool.query(`
        SELECT u.id, u.first_name, u.last_name, u.department, u.email, p.resume_url, p.resume_status 
        FROM users u
        LEFT JOIN placement_progress p ON u.id = p.user_id
        WHERE u.role_id = 3
    `);
    
    const matrix = [];
    for (const intern of interns) {
        const [skills] = await pool.query(`
            SELECT s.name, us.current_level 
            FROM user_skills us JOIN skills s ON us.skill_id = s.id 
            WHERE us.user_id = ?`, [intern.id]);
            
        matrix.push({
            id: intern.id,
            name: `${intern.first_name} ${intern.last_name}`,
            department: intern.department,
            email: intern.email,
            skills: skills
        });
    }
    return matrix;
};

export const getTopInterns = async () => {
    // Top interns based on DSA hard/medium counts + interview scores
    const [interns] = await pool.query(`
        SELECT u.id, u.first_name, u.last_name, u.department, u.email,
               p.dsa_easy_count, p.dsa_medium_count, p.dsa_hard_count,
               (IFNULL(p.dsa_hard_count, 0) * 3 + IFNULL(p.dsa_medium_count, 0) * 2 + IFNULL(p.dsa_easy_count, 0)) as dsa_score,
               (SELECT AVG(score) FROM mock_interviews m WHERE m.user_id = u.id AND m.status = 'completed') as avg_interview_score
        FROM users u
        LEFT JOIN placement_progress p ON u.id = p.user_id
        WHERE u.role_id = 3
        ORDER BY dsa_score DESC, avg_interview_score DESC
        LIMIT 5
    `);
    
    return interns;
};

export const saveUploadedResumeUrl = async (userId, resumeUrl) => {
    // Ensure progress record exists
    await getPlacementProgress(userId);

    await pool.query(
        'UPDATE placement_progress SET resume_url = ?, resume_status = "review" WHERE user_id = ?',
        [resumeUrl, userId]
    );

    return { resume_url: resumeUrl, resume_status: 'review' };
};

