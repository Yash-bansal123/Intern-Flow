import React, { createContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { selectAccessToken, selectIsAuthenticated } from '../store/authSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export const SocketContext = createContext({
  socket: null,
});

/**
 * SocketProvider – provides a singleton Socket.IO connection
 * to the entire component tree. Connects on auth, disconnects on logout.
 */
export const SocketProvider = ({ children }) => {
  const socketRef       = useRef(null);
  const accessToken     = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Avoid duplicate connections
    if (socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current.on('connect', () =>
      console.info('[SocketCtx] Connected:', socketRef.current.id),
    );

    socketRef.current.on('disconnect', (reason) =>
      console.info('[SocketCtx] Disconnected:', reason),
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
