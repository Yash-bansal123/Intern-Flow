import React from 'react';
import { Box, Grid, Paper, Typography, Link, useTheme } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const theme = useTheme();

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: 'linear-gradient(-45deg, #4f46e5, #3b82f6, #06b6d4, #7c3aed)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          p: 6,
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
            background: 'rgba(99, 102, 241, 0.4)',
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
            background: 'rgba(6, 182, 212, 0.4)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        <Box 
          component="img"
          src="/login_hero.png"
          alt="InternFlow Illustration"
          sx={{
            width: '80%',
            maxWidth: 400,
            height: 'auto',
            mb: 5,
            filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.35))',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 2,
            '@keyframes float': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-15px)' },
              '100%': { transform: 'translateY(0px)' }
            }
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
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5
            }}
          >
            InternFlow
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.6, px: 1 }}>
            The complete platform for managing internships, tracking skill growth, and preparing for placements.
          </Typography>
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 450,
            ml: 'auto',
            mr: 'auto'
          }}
        >
          {/* Brand Logo Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366F1 0%, #06b6d4 100%)',
              color: 'white',
              mb: 3,
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Please enter your credentials to access your account.
          </Typography>

          <LoginForm />

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/register" variant="body2" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
