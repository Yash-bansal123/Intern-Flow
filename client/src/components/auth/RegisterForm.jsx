import React, { useState } from 'react';
import { Box, TextField, Button, Grid, CircularProgress, MenuItem } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const ROLES = [
  { value: 'student', label: 'Student / Intern' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'placement_coordinator', label: 'Placement Coordinator' }
];

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'student',
    department: '',
    college: ''
  });
  
  const { register, isLoading } = useAuth();
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'confirm_password' || e.target.name === 'password') {
        setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
        setPasswordError('Passwords do not match');
        return;
    }
    
    // eslint-disable-next-line no-unused-vars
    const { confirm_password, ...submitData } = formData;
    await register(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={() => setFormData({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane.doe@demo.com',
            password: 'Password123!',
            confirm_password: 'Password123!',
            role: 'student',
            department: 'Computer Science',
            college: 'Demo University'
          })}
          sx={{
            borderRadius: '20px',
            borderColor: 'divider',
            color: 'text.secondary',
            textTransform: 'none',
            fontSize: '0.78rem',
            fontWeight: 500,
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'rgba(99, 102, 241, 0.04)'
            }
          }}
        >
          ✨ Fill Dummy Details
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="first_name" required fullWidth label="First Name" autoFocus value={formData.first_name} onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="last_name" required fullWidth label="Last Name" value={formData.last_name} onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            name="email" required fullWidth label="Email Address" type="email" value={formData.email} onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="password" required fullWidth label="Password" type="password" value={formData.password} onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            name="confirm_password" required fullWidth label="Confirm Password" type="password" 
            value={formData.confirm_password} onChange={handleChange} 
            error={!!passwordError} helperText={passwordError}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            select name="role" required fullWidth label="I am a..." value={formData.role} onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          >
            {ROLES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {formData.role === 'student' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="department" fullWidth label="Department (Optional)" value={formData.department} onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="college" fullWidth label="College/University (Optional)" value={formData.college} onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{ 
          mt: 4, 
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>
    </Box>
  );
};

export default RegisterForm;
