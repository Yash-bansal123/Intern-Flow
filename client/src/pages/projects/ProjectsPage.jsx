import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { Add, FolderOpen, AccessTime } from '@mui/icons-material';
import { projectApi } from '../../api/projectApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProjectsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth.user);
  
  const rawRole = user?.role || user?.role_name || '';
  const roleNorm = rawRole.toLowerCase().replace(/\s+/g, '_');
  const canCreateProject = ['admin', 'super_admin', 'placement_coordinator', 'team_lead'].includes(roleNorm);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectApi.getAllProjects();
      setProjects(data || []);
    } catch (err) {
      enqueueSnackbar('Failed to load projects', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      start_date: '',
      end_date: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      enqueueSnackbar('Project name is required', { variant: 'warning' });
      return;
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      enqueueSnackbar('Start date cannot be after end date', { variant: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      await projectApi.createProject(formData);
      enqueueSnackbar('Project created successfully', { variant: 'success' });
      handleClose();
      fetchProjects();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create project', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'planning': return 'info';
      case 'on_hold': return 'warning';
      case 'completed': return 'default';
      default: return 'primary';
    }
  };

  if (loading) return <LoadingSpinner message="Loading projects..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Projects
        </Typography>
        {canCreateProject && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ borderRadius: 8, px: 3 }}>
            New Project
          </Button>
        )}
      </Box>

      {projects.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 8, bgcolor: 'background.paper', borderRadius: 4, border: `1px dashed ${theme.palette.divider}` }}>
          <FolderOpen sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No projects found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {canCreateProject ? 'Get started by creating your first project.' : 'You have not been assigned to any projects yet.'}
          </Typography>
          {canCreateProject && (
            <Button variant="outlined" startIcon={<Add />} onClick={handleOpen}>Create Project</Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                      {project.name}
                    </Typography>
                    <Chip 
                      label={project.status.replace('_', ' ')} 
                      color={getStatusColor(project.status)} 
                      size="small" 
                      sx={{ textTransform: 'capitalize' }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description || 'No description provided.'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                    {project.start_date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" />
                            {new Date(project.start_date).toLocaleDateString()}
                        </Box>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button size="small" variant="outlined" fullWidth onClick={() => navigate(`/projects/${project.id}`)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Project Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle fontWeight="bold">Create New Project</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
              variant="outlined"
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="end_date"
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;
