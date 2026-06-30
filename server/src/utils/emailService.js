import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

import fs from 'fs';
import path from 'path';

const logEmailLocal = (to, subject, html) => {
    try {
        const logPath = path.resolve(process.cwd(), '../emails.txt');
        const date = new Date().toISOString();
        
        // Extract any links in the HTML
        const links = [];
        const regex = /href="([^"]+)"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            links.push(match[1]);
        }
        
        const logContent = `======================================================================
TIMESTAMP: ${date}
ORIGINAL RECIPIENT: ${to}
SUBJECT: ${subject}
LINKS FOUND:
${links.map(l => `  - ${l}`).join('\n')}
----------------------------------------------------------------------
BODY (Text):
${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
======================================================================\n\n`;

        fs.appendFileSync(logPath, logContent, 'utf8');
        console.log(`✉️ [Email Service] Logged email locally to ${logPath}`);
    } catch (err) {
        console.error('[Email Service] Failed to log email locally:', err);
    }
};

export const sendEmail = async (to, subject, html) => {
    // Log locally first as a fail-safe
    logEmailLocal(to, subject, html);
    
    try {
        const testRecipient = 'bansal2580789@gmail.com';
        console.log(`✉️ [Email Service] Routing email meant for ${to} to testing override: ${testRecipient}`);
        const info = await transporter.sendMail({
            from: `"InternFlow" <${process.env.SMTP_USER || 'bansal2580789@gmail.com'}>`,
            to: testRecipient,
            subject: `[For: ${to}] ${subject}`,
            html: `
                <div style="background-color: #f3f4f6; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 6px; margin-bottom: 20px; font-family: sans-serif; color: #334155; font-size: 0.9rem;">
                    <strong>[INTERNFLOW TEST INTERCEPT]</strong> Originally addressed to: <code>${to}</code>
                </div>
                ${html}
            `
        });
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export const sendVerificationEmail = async (to, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    console.log(`✉️  [Email Service] Verification link for ${to}: ${url}`);
    const html = `
        <h1>Verify your email</h1>
        <p>Welcome to InternFlow. Please click the link below to verify your email address:</p>
        <a href="${url}">${url}</a>
    `;
    return sendEmail(to, 'InternFlow - Verify your email', html);
};

export const sendPasswordResetEmail = async (to, token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    console.log(`✉️  [Email Service] Password reset link for ${to}: ${url}`);
    const html = `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset it:</p>
        <a href="${url}">${url}</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
    `;
    return sendEmail(to, 'InternFlow - Password Reset', html);
};

export const sendTaskAssignmentEmail = async (to, taskName, projectName) => {
    const html = `
        <h1>New Task Assigned</h1>
        <p>You have been assigned a new task: <strong>${taskName}</strong> in project <strong>${projectName}</strong>.</p>
        <p>Log in to InternFlow to view the details.</p>
    `;
    return sendEmail(to, 'InternFlow - New Task Assignment', html);
};

export const sendFeedbackEmail = async (to, taskName, rating) => {
    const html = `
        <h1>New Mentor Feedback</h1>
        <p>You have received new feedback for <strong>${taskName}</strong>.</p>
        <p>Rating: ${rating} / 5</p>
        <p>Log in to InternFlow to view the detailed review.</p>
    `;
    return sendEmail(to, 'InternFlow - Mentor Feedback Received', html);
};
