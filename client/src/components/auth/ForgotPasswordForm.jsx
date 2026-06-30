import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { validateEmail, validateRequired, validateForm } from '../../utils/validators';

/**
 * ForgotPasswordForm – email field + submit to request a reset link.
 */
const ForgotPasswordForm = ({ onSubmit, loading = false, error = null }) => {
  const theme = useTheme();
  const [email, setEmail]     = useState('');
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: newErrors } = validateForm({
      email: [() => validateRequired(email, 'Email'), () => validateEmail(email)],
    });
    if (!isValid) { setErrors(newErrors); return; }
    setErrors({});

    try {
      await onSubmit?.({ email });
      setSuccess(true);
    } catch {
      // error is handled by parent via prop
    }
  };

  if (success) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Check your email
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </Typography>
        <Button component={RouterLink} to="/login" variant="outlined">
          Back to Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button size="small" variant="outlined" onClick={() => setEmail('jane.doe@demo.com')}>
          Use Dummy Email
        </Button>
      </Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Forgot password?
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
      )}

      <TextField
        fullWidth
        name="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          py: 1.5,
          fontWeight: 700,
          background: theme.custom.gradients.accent,
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Send Reset Link'}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
        Remember your password?{' '}
        <Typography
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
        >
          Sign in
        </Typography>
      </Typography>
    </Box>
  );
};

export default ForgotPasswordForm;
