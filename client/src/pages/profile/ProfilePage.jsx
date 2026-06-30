import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Avatar, Button, Divider, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton,
  InputAdornment, Switch, FormControlLabel, Alert, CircularProgress
} from '@mui/material';
import {
  Edit, Save, Cancel, Visibility, VisibilityOff,
  LightMode, DarkMode, Lock, Person, Email, Phone, School, Business, GitHub
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { toggleThemeMode } from '../../store/uiSlice';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../api/axiosInstance';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth.user);
  const themeMode = useSelector((state) => state.ui.themeMode);

  // ── Edit Profile State ──
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    department: user?.department || '',
    college: user?.college || '',
    github_username: user?.github_username || '',
  });

  // ── Change Password State ──
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdError, setPwdError] = useState('');

  if (!user) return null;

  const roleLabel = user.role || user.role_name || 'User';

  const getRoleColor = (role) => {
    const map = { Admin: 'error', 'Super Admin': 'error', Mentor: 'warning', 'Team Lead': 'success', 'Placement Coordinator': 'secondary', Intern: 'primary', Student: 'primary', HR: 'info' };
    return map[role] || 'default';
  };

  // ── Edit Profile ──
  const handleEditOpen = () => {
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      department: user.department || '',
      college: user.college || '',
      github_username: user.github_username || '',
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editForm.first_name.trim()) {
      enqueueSnackbar('First name is required', { variant: 'warning' });
      return;
    }
    setEditLoading(true);
    try {
      const updated = await userApi.updateProfile(user.id, editForm);
      // updated is the new user object from the server
      dispatch(setUser({ ...user, ...updated }));
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      setEditOpen(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update profile', { variant: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  // ── Theme Toggle ──
  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
    enqueueSnackbar(`Switched to ${themeMode === 'dark' ? 'light' : 'dark'} mode`, { variant: 'info' });
  };

  // ── Change Password ──
  const handlePasswordSave = async () => {
    setPwdError('');
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      setPwdError('All fields are required.');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      // POST /auth/change-password — if endpoint does not exist yet, we handle gracefully
      await axiosInstance.post('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      enqueueSnackbar('Password changed successfully!', { variant: 'success' });
      setPwdOpen(false);
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      setPwdError(msg);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>My Profile</Typography>

      {/* ── Profile Card ── */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar
              src={user.profile_picture_url}
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem', fontWeight: 'bold' }}
            >
              {user.first_name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Grid>

          <Grid item xs>
            <Typography variant="h5" fontWeight="bold">
              {user.first_name} {user.last_name}
            </Typography>
            <Chip
              label={roleLabel}
              color={getRoleColor(roleLabel)}
              size="small"
              sx={{ mt: 0.5, mb: 1 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{user.phone}</Typography>
                </Box>
              )}
              {user.department && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business fontSize="small" color="action" />
                  <Typography variant="body2">{user.department}</Typography>
                </Box>
              )}
              {user.college && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School fontSize="small" color="action" />
                  <Typography variant="body2">{user.college}</Typography>
                </Box>
              )}
              {user.github_username && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GitHub fontSize="small" color="action" />
                  <Typography variant="body2">
                    <a href={`https://github.com/${user.github_username}`} target="_blank" rel="noopener noreferrer" style={{ color: 'primary.main', textDecoration: 'none', fontWeight: 550 }}>
                      github.com/{user.github_username}
                    </a>
                  </Typography>
                </Box>
              )}
            </Box>
            {user.bio && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                "{user.bio}"
              </Typography>
            )}
          </Grid>

          <Grid item>
            <Button variant="contained" startIcon={<Edit />} onClick={handleEditOpen} sx={{ borderRadius: 2 }}>
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ── Account Settings ── */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Account Settings</Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Theme */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {themeMode === 'dark' ? <DarkMode sx={{ mr: 1, verticalAlign: 'middle' }} /> : <LightMode sx={{ mr: 1, verticalAlign: 'middle' }} />}
              Theme Preference
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently using <strong>{themeMode}</strong> mode.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={themeMode === 'dark'}
                onChange={handleThemeToggle}
                color="primary"
              />
            }
            label={themeMode === 'dark' ? 'Dark' : 'Light'}
          />
        </Box>

        {/* Password */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              <Lock sx={{ mr: 1, verticalAlign: 'middle' }} />
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your account password securely.
            </Typography>
          </Box>
          <Button variant="outlined" color="secondary" onClick={() => { setPwdOpen(true); setPwdError(''); setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}>
            Update Password
          </Button>
        </Box>
      </Paper>

      {/* ── Edit Profile Dialog ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Edit Profile</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="First Name"
              value={editForm.first_name}
              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              value={editForm.last_name}
              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
              fullWidth
            />
          </Box>
          <TextField
            label="Phone"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }}
          />
          <TextField
            label="Department"
            value={editForm.department}
            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
            fullWidth
          />
          <TextField
            label="College / Institution"
            value={editForm.college}
            onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
            fullWidth
          />
          <TextField
            label="GitHub Username"
            value={editForm.github_username}
            onChange={(e) => setEditForm({ ...editForm, github_username: e.target.value })}
            fullWidth
            placeholder="e.g. octocat"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GitHub fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Bio"
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            fullWidth
            multiline
            rows={3}
            placeholder="Tell us about yourself..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)} startIcon={<Cancel />}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={editLoading} startIcon={editLoading ? <CircularProgress size={16} /> : <Save />}>
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Change Password Dialog ── */}
      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Change Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {pwdError && <Alert severity="error">{pwdError}</Alert>}
          <TextField
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            value={pwdForm.currentPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end">
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showNew ? 'text' : 'password'}
            value={pwdForm.newPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
            fullWidth
            helperText="Minimum 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            value={pwdForm.confirmPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handlePasswordSave} disabled={pwdLoading} startIcon={pwdLoading ? <CircularProgress size={16} /> : <Lock />}>
            {pwdLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
