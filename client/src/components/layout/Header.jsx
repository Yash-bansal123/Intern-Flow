import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Box, useTheme, Avatar,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, Badge, Tooltip,
  Popover, List, ListItem, Chip
} from '@mui/material';
import {
  Menu as MenuIcon, LightMode, DarkMode, Notifications,
  AccountCircle, Logout, Settings, Person, CheckCircleOutline,
  Assignment, RateReview, FiberManualRecord
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleThemeMode } from '../../store/uiSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Static sample notifications — replace with API call when backend ready
const STATIC_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Assignment fontSize="small" color="primary" />,
    title: 'New task assigned',
    message: '"Build Login API" has been assigned to you.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    icon: <RateReview fontSize="small" color="success" />,
    title: 'Mentor feedback received',
    message: 'Ankit Sharma submitted your bi-weekly feedback.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    icon: <CheckCircleOutline fontSize="small" color="warning" />,
    title: 'Daily log approved',
    message: 'Your log for June 20 has been approved.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 4,
    icon: <Assignment fontSize="small" color="error" />,
    title: 'Task overdue',
    message: '"Fix Sidebar Navigation" is 2 days overdue.',
    time: '2 days ago',
    read: true,
  },
];

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const themeMode = useSelector((state) => state.ui.themeMode);
  const user = useSelector((state) => state.auth.user);

  // Profile menu state
  const [profileAnchor, setProfileAnchor] = useState(null);
  // Notification popover state
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogout = async () => {
    handleProfileClose();
    await logout();
  };

  const handleProfile = () => {
    handleProfileClose();
    navigate('/profile');
  };

  const getRoleLabel = (role) => {
    const map = {
      admin: 'Admin',
      super_admin: 'Super Admin',
      mentor: 'Mentor',
      team_lead: 'Team Lead',
      placement_coordinator: 'Coordinator',
      student: 'Student',
      intern: 'Intern',
      hr: 'HR',
    };
    return map[role] || role || 'User';
  };

  const getRoleColor = (role) => {
    const map = {
      admin: 'error',
      super_admin: 'error',
      mentor: 'warning',
      team_lead: 'success',
      placement_coordinator: 'secondary',
      student: 'primary',
      intern: 'primary',
      hr: 'info',
    };
    return map[role] || 'default';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        backdropFilter: 'blur(8px)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Sidebar Toggle */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => dispatch(toggleSidebar())} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            InternFlow
          </Typography>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          {/* Theme Toggle */}
          <Tooltip title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton color="inherit" onClick={() => dispatch(toggleThemeMode())}>
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications Bell */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotifOpen}>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Avatar */}
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileOpen} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: `2px solid ${theme.palette.primary.light}`,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* ── Profile Dropdown Menu ── */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, minWidth: 240, borderRadius: 2, overflow: 'visible' },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 'bold' }}>
              {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={getRoleLabel(user?.role || user?.role_name)}
                  color={getRoleColor(user?.role || user?.role_name)}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleProfileClose} sx={{ py: 1.5 }}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* ── Notification Popover ── */}
      <Popover
        open={Boolean(notifAnchor)}
        anchorEl={notifAnchor}
        onClose={handleNotifClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ elevation: 3, sx: { mt: 1, width: 380, borderRadius: 2 } }}
      >
        {/* Notif Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
            {unreadCount > 0 && (
              <Chip label={unreadCount} color="error" size="small" sx={{ ml: 1, height: 18, fontSize: '0.65rem' }} />
            )}
          </Typography>
          {unreadCount > 0 && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Typography>
          )}
        </Box>

        {/* Notification List */}
        <List disablePadding sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            notifications.map((notif, idx) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleMarkRead(notif.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    cursor: 'pointer',
                    bgcolor: notif.read ? 'transparent' : (theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)'),
                    '&:hover': { bgcolor: 'action.hover' },
                    gap: 1.5,
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ mt: 0.5, flexShrink: 0 }}>{notif.icon}</Box>

                  {/* Content */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" fontWeight={notif.read ? 'normal' : 'bold'} noWrap>
                        {notif.title}
                      </Typography>
                      {!notif.read && (
                        <FiberManualRecord sx={{ fontSize: 8, color: 'primary.main', ml: 1, mt: 0.5, flexShrink: 0 }} />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.3 }}>
                      {notif.time}
                    </Typography>
                  </Box>
                </ListItem>
                {idx < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          )}
        </List>

        {/* Footer */}
        <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          >
            View all notifications
          </Typography>
        </Box>
      </Popover>
    </AppBar>
  );
};

export default Header;
