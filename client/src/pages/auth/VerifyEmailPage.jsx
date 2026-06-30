import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Container } from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { authApi } from '../../api/authApi';
import { useSnackbar } from 'notistack';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        enqueueSnackbar(response.message || 'Email verified successfully!', { variant: 'success' });
      } catch (err) {
        setStatus('error');
        const message = err.response?.data?.message || 'Verification link is invalid or has expired.';
        setErrorMessage(message);
        enqueueSnackbar(message, { variant: 'error' });
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setErrorMessage('Verification token is missing.');
    }
  }, [token, enqueueSnackbar]);

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, textAlign: 'center' }}>
        {status === 'verifying' && (
          <Box sx={{ py: 4 }}>
            <CircularProgress size={50} sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Verifying Your Email
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we confirm your email address...
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Box sx={{ py: 2 }}>
            <CheckCircleOutline color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Email Verified!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your email has been successfully verified. You can now access all features of InternFlow.
            </Typography>
            <Button
              fullWidth variant="contained" onClick={() => navigate('/login')}
              sx={{ py: 1.5, background: 'linear-gradient(45deg, #6366F1 30%, #22D3EE 90%)', color: 'white' }}
            >
              Go to Sign In
            </Button>
          </Box>
        )}

        {status === 'error' && (
          <Box sx={{ py: 2 }}>
            <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Verification Failed
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {errorMessage}
            </Typography>
            <Button
              fullWidth variant="outlined" onClick={() => navigate('/login')}
              sx={{ py: 1.5 }}
            >
              Back to Sign In
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmailPage;
