import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { selectAccessToken, selectIsAuthenticated } from '../store/authSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

/**
 * useSocket – manage a Socket.IO connection tied to auth state.
 * Connects when authenticated, disconnects on logout.
 */
const useSocket = () => {
  const socketRef     = useRef(null);
  const accessToken   = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      // Disconnect if we lose auth
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Already connected with the same token?
    if (socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    socketRef.current.on('connect', () => {
      console.info('[Socket] Connected:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.info('[Socket] Disconnected:', reason);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, accessToken]);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    connected: socketRef.current?.connected ?? false,
  };
};

export default useSocket;
