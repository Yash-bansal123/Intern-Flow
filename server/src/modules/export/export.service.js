import pool from '../../config/database.js';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { ApiError } from '../../utils/ApiError.js';

export const exportUserDataCsv = async (userId) => {
    const [tasks] = await pool.query('SELECT title, task_type as type, priority, status, created_at FROM tasks WHERE assignee_id = ?', [userId]);
    
    if (tasks.length === 0) return '';
    
    const parser = new Parser();
    const csv = parser.parse(tasks);
    return csv;
};

export const exportUserDataPdf = async (userId, userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            doc.fontSize(20).text(`InternFlow Report: ${userDetails.first_name} ${userDetails.last_name}`, { align: 'center' });
            doc.moveDown();
            
            doc.fontSize(14).text(`Role: ${userDetails.role}`);
            doc.text(`Email: ${userDetails.email}`);
            doc.moveDown();

            const [tasks] = await pool.query('SELECT title, status FROM tasks WHERE assignee_id = ? LIMIT 10', [userId]);
            
            doc.fontSize(16).text('Recent Tasks:');
            tasks.forEach(t => {
                doc.fontSize(12).text(`- [${t.status}] ${t.title}`);
            });

            doc.end();
        } catch (e) {
            reject(e);
        }
    });
};
