import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';

export const createInternship = async (internshipData) => {
    const { user_id, mentor_id, title, company, start_date, end_date } = internshipData;
    
    const [result] = await pool.query(
        `INSERT INTO internships (user_id, mentor_id, title, company, start_date, end_date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, mentor_id || null, title, company || 'InternFlow internal', start_date, end_date]
    );

    return getInternshipById(result.insertId);
};

export const getInternshipById = async (id) => {
    const [internships] = await pool.query(
        `SELECT i.*, 
                u.first_name as intern_first_name, u.last_name as intern_last_name, u.profile_picture_url as intern_avatar,
                m.first_name as mentor_first_name, m.last_name as mentor_last_name
         FROM internships i
         JOIN users u ON i.user_id = u.id
         LEFT JOIN users m ON i.mentor_id = m.id
         WHERE i.id = ?`,
        [id]
    );
    if (internships.length === 0) throw ApiError.notFound('Internship not found');
    return internships[0];
};

export const getUserInternships = async (userId) => {
    const [internships] = await pool.query('SELECT * FROM internships WHERE user_id = ? ORDER BY start_date DESC', [userId]);
    return internships;
};

export const getAllInternships = async () => {
    const [internships] = await pool.query(
        `SELECT i.*,
                u.first_name as intern_first_name, u.last_name as intern_last_name, u.email as intern_email,
                m.first_name as mentor_first_name, m.last_name as mentor_last_name
         FROM internships i
         JOIN users u ON i.user_id = u.id
         LEFT JOIN users m ON i.mentor_id = m.id
         ORDER BY i.start_date DESC`
    );
    return internships;
};

// --- Logs & Attendance ---
export const addDailyLog = async (internshipId, logData) => {
    const { log_date, activities, work_summary, challenges, learnings, hours_logged, hours_worked } = logData;
    
    const resolvedActivities = activities || work_summary;
    const resolvedHours = hours_logged || hours_worked || 8.00;

    // Check if log already exists for date
    const [existing] = await pool.query('SELECT id FROM internship_logs WHERE internship_id = ? AND log_date = ?', [internshipId, log_date]);
    if (existing.length > 0) throw ApiError.conflict('A log for this date already exists');

    await pool.query(
        `INSERT INTO internship_logs (internship_id, log_date, activities, challenges, learnings, hours_logged) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [internshipId, log_date, resolvedActivities, challenges || null, learnings || null, resolvedHours]
    );

    // Auto-mark attendance
    await pool.query(
        `INSERT IGNORE INTO internship_attendance (internship_id, date, status) VALUES (?, ?, 'present')`,
        [internshipId, log_date]
    );

    return { message: 'Log added successfully' };
};

export const getInternshipLogs = async (internshipId) => {
    const [logs] = await pool.query('SELECT * FROM internship_logs WHERE internship_id = ? ORDER BY log_date DESC', [internshipId]);
    return logs;
};
