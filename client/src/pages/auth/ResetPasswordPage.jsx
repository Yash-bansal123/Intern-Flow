import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Container, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';
import { authApi } from '../../api/authApi';
import { useSnackbar } from 'notistack';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);
    setPasswordError('');
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      enqueueSnackbar('Password reset successful!', { variant: 'success' });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password. Link may have expired.';
      setPasswordError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleOutline color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Password Reset Complete
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your password has been successfully updated. You can now use your new password to sign in.
            </Typography>
            <Button
              fullWidth variant="contained" onClick={() => navigate('/login')}
              sx={{ py: 1.5, background: 'linear-gradient(45deg, #6366F1 30%, #22D3EE 90%)', color: 'white' }}
            >
              Back to Sign In
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography component="h1" variant="h5" align="center" fontWeight="bold" gutterBottom>
              Create New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Enter your new secure password below.
            </Typography>

            <TextField
              margin="normal" required fullWidth name="password" label="New Password"
              type={showPassword ? 'text' : 'password'} id="password" value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal" required fullWidth name="confirmPassword" label="Confirm New Password"
              type="password" id="confirmPassword" value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError('');
              }}
              error={!!passwordError} helperText={passwordError}
            />

            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, background: 'linear-gradient(45deg, #6366F1 30%, #22D3EE 90%)', color: 'white' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
