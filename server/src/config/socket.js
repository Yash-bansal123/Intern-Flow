import { Server } from 'socket.io';
import { verifyToken } from '../utils/tokenUtils.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = verifyToken(token);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user.id;
        
        // Join personal room
        socket.join(`user:${userId}`);
        console.log(`User ${userId} connected and joined room user:${userId}`);

        // Custom join for projects/sprints based on client request
        socket.on('join_project', (projectId) => {
            socket.join(`project:${projectId}`);
            console.log(`User ${userId} joined project:${projectId}`);
        });

        socket.on('leave_project', (projectId) => {
            socket.leave(`project:${projectId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

export const getIo = getIO;
