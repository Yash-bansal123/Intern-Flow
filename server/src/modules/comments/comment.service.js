import pool from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getIo } from '../../config/socket.js';

export const createComment = async (commentData, userId) => {
    const { task_id, content } = commentData;

    // Verify task exists
    const [tasks] = await pool.query('SELECT id FROM tasks WHERE id = ?', [task_id]);
    if (tasks.length === 0) throw ApiError.notFound('Task not found');

    const [result] = await pool.query(
        'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
        [task_id, userId, content]
    );

    const newComment = await getCommentById(result.insertId);

    // Emit Socket.IO Event for Real-time Updates
    const io = getIo();
    if (io) {
        io.to(`task_${task_id}`).emit('new_comment', newComment);
    }

    return newComment;
};

export const getCommentById = async (id) => {
    const [comments] = await pool.query(
        `SELECT c.*, u.first_name, u.last_name, u.profile_picture_url 
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [id]
    );
    if (comments.length === 0) throw ApiError.notFound('Comment not found');
    return comments[0];
};

export const getTaskComments = async (taskId) => {
    const [comments] = await pool.query(
        `SELECT c.*, u.first_name, u.last_name, u.profile_picture_url 
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.task_id = ?
         ORDER BY c.created_at ASC`,
        [taskId]
    );
    return comments;
};

export const updateComment = async (id, userId, content) => {
    const comment = await getCommentById(id);
    if (comment.user_id !== userId) throw ApiError.forbidden('You can only edit your own comments');

    await pool.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
    
    const updatedComment = await getCommentById(id);
    
    // Emit Socket.IO Event
    const io = getIo();
    if (io) {
        io.to(`task_${comment.task_id}`).emit('update_comment', updatedComment);
    }

    return updatedComment;
};

export const deleteComment = async (id, userId, userRole) => {
    const comment = await getCommentById(id);
    
    // Only author or admin/mentor can delete
    if (comment.user_id !== userId && !['admin', 'mentor'].includes(userRole)) {
        throw ApiError.forbidden('You do not have permission to delete this comment');
    }

    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    
    // Emit Socket.IO Event
    const io = getIo();
    if (io) {
        io.to(`task_${comment.task_id}`).emit('delete_comment', { id });
    }
};
