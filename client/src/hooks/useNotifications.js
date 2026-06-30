import { useState, useEffect, useCallback, useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

/**
 * useNotifications – listen for real-time notification events
 * and manage a local notification list.
 */
const useNotifications = () => {
  const { socket }   = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);

  // Listen for incoming notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    };

    const handleInitialNotifications = (data) => {
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    };

    socket.on('notification', handleNotification);
    socket.on('notifications:init', handleInitialNotifications);

    // Request initial notifications on connect
    socket.emit('notifications:get');

    return () => {
      socket.off('notification', handleNotification);
      socket.off('notifications:init', handleInitialNotifications);
    };
  }, [socket]);

  const markAsRead = useCallback(
    (notificationId) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      socket?.emit('notification:read', { notificationId });
    },
    [socket],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    socket?.emit('notifications:readAll');
  }, [socket]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    clearAll,
  };
};

export default useNotifications;
