import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            transition: 'all 0.2s ease-in-out',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            }
          }
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            transition: 'all 0.2s ease-in-out',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            }
          }
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Link href="/forgot-password" variant="body2" color="primary" sx={{ textDecoration: 'none', fontWeight: 500 }}>
          Forgot password?
        </Link>
      </Box>

      <Box sx={{ mt: 3, mb: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2, fontWeight: 500 }}>
          Quick Demo Login
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            size="small" 
            variant="text"
            onClick={() => { setEmail('admin@demo.com'); setPassword('password123'); }}
            sx={{
              borderRadius: '20px',
              bgcolor: 'rgba(99, 102, 241, 0.08)',
              color: '#4f46e5',
              px: 2,
              py: 0.6,
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid rgba(99, 102, 241, 0.15)',
              '&:hover': {
                bgcolor: '#4f46e5',
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            🛡️ Admin
          </Button>
          <Button 
            size="small" 
            variant="text"
            onClick={() => { setEmail('coordinator@demo.com'); setPassword('password123'); }}
            sx={{
              borderRadius: '20px',
              bgcolor: 'rgba(6, 182, 212, 0.08)',
              color: '#0891b2',
              px: 2,
              py: 0.6,
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid rgba(6, 182, 212, 0.15)',
              '&:hover': {
                bgcolor: '#0891b2',
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            💼 Coordinator
          </Button>
          <Button 
            size="small" 
            variant="text"
            onClick={() => { setEmail('mentor@demo.com'); setPassword('password123'); }}
            sx={{
              borderRadius: '20px',
              bgcolor: 'rgba(245, 158, 11, 0.08)',
              color: '#d97706',
              px: 2,
              py: 0.6,
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid rgba(245, 158, 11, 0.15)',
              '&:hover': {
                bgcolor: '#d97706',
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            🎓 Mentor
          </Button>
          <Button 
            size="small" 
            variant="text"
            onClick={() => { setEmail('teamlead@demo.com'); setPassword('password123'); }}
            sx={{
              borderRadius: '20px',
              bgcolor: 'rgba(16, 185, 129, 0.08)',
              color: '#059669',
              px: 2,
              py: 0.6,
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.15)',
              '&:hover': {
                bgcolor: '#059669',
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            👥 Lead
          </Button>
          <Button 
            size="small" 
            variant="text"
            onClick={() => { setEmail('student@demo.com'); setPassword('password123'); }}
            sx={{
              borderRadius: '20px',
              bgcolor: 'rgba(59, 130, 246, 0.08)',
              color: '#2563eb',
              px: 2,
              py: 0.6,
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid rgba(59, 130, 246, 0.15)',
              '&:hover': {
                bgcolor: '#2563eb',
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            ⚡ Intern
          </Button>
        </Box>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ 
          mt: 3, 
          mb: 2, 
          py: 1.5,
          fontSize: '0.95rem',
          fontWeight: 600,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
          transition: 'all 0.25s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.45)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  );
};

export default LoginForm;
