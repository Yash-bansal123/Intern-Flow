import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link, Container } from '@mui/material';
import { authApi } from '../../api/authApi';
import { useSnackbar } from 'notistack';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      enqueueSnackbar(response.message || 'If that email exists, a password reset link has been sent.', { variant: 'success' });
    } catch (err) {
      const message = err.response?.data?.message || 'If that email exists, a password reset link has been sent.';
      enqueueSnackbar(message, { variant: 'success' }); // Security: always show success to not leak registered emails
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Typography component="h1" variant="h5" align="center" fontWeight="bold" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal" required fullWidth id="email" label="Email Address"
            name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit" fullWidth variant="contained" disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Send Reset Link
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2" sx={{ textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
