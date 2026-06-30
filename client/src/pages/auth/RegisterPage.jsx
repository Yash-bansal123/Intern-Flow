import React from 'react';
import { Box, Grid, Paper, Typography, Link, useTheme } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  const theme = useTheme();

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ my: 6, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 500, ml: 'auto', mr: 'auto' }}>
          {/* Brand Logo Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #06b6d4 0%, #6366F1 100%)',
              color: 'white',
              mb: 3,
              boxShadow: '0 8px 16px rgba(6, 182, 212, 0.25)',
              transform: 'rotate(-5deg)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(5deg) scale(1.05)'
              }
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: '-0.05em', select: 'none' }}>
              IF
            </Typography>
          </Box>

          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.mode === 'light' ? '#0f172a' : '#f8fafc' }}>
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
            Join InternFlow to start managing your growth and tasks.
          </Typography>

          <RegisterForm />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" variant="body2" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid
        item xs={false} sm={4} md={6}
        sx={{
          background: 'linear-gradient(-45deg, #06B6D4, #0891B2, #6366F1, #4f46e5)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          },
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', p: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Effects */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.4)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.4)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        <Box 
          sx={{ 
            maxWidth: 480, 
            textAlign: 'center', 
            zIndex: 2,
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Your Growth Journey Starts Here
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Connect with mentors, track your skills, and prepare for placements in one unified platform.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
