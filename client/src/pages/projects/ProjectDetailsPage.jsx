import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Chip, Divider, Tabs, Tab, Button, Avatar, 
  List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, Card, CardContent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import { sprintApi } from '../../api/sprintApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Settings, Add, Delete, Edit, Group, CalendarToday, Folder } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import KanbanBoard from '../tasks/KanbanBoard';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  // Members Management
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [memberRole, setMemberRole] = useState('developer');
  const [addingMember, setAddingMember] = useState(false);

  // Sprints Management
  const [sprints, setSprints] = useState([]);
  const [sprintOpen, setSprintOpen] = useState(false);
  const [sprintSubmitting, setSprintSubmitting] = useState(false);
  const [sprintForm, setSprintForm] = useState({
    name: '',
    start_date: '',
    end_date: ''
  });

  // Project Edit
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: ''
  });

  const userRole = user?.role || user?.role_name;
  const canManage = ['admin', 'mentor', 'team_lead'].includes(userRole);
  const canDelete = ['admin', 'mentor'].includes(userRole);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (tabIndex === 3) {
      fetchMembers();
    } else if (tabIndex === 1) {
      fetchSprints();
    }
  }, [tabIndex]);

  const fetchProjectDetails = async () => {
    try {
      const data = await projectApi.getProjectById(id);
      setProject(data);
      setEditForm({
        name: data.name,
        description: data.description || '',
        status: data.status
      });
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      enqueueSnackbar('Failed to load project details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await projectApi.getProjectMembers(id);
      setMembers(data || []);
    } catch (err) {
      enqueueSnackbar('Failed to load project members', { variant: 'error' });
    }
  };

  const fetchSprints = async () => {
    try {
      const data = await sprintApi.getProjectSprints(id);
      setSprints(data || []);
    } catch (err) {
      enqueueSnackbar('Failed to load sprints', { variant: 'error' });
    }
  };

  // --- Project Actions ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const updated = await projectApi.updateProject(id, editForm);
      setProject(updated);
      enqueueSnackbar('Project updated successfully', { variant: 'success' });
      setEditOpen(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update project', { variant: 'error' });
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectApi.deleteProject(id);
        enqueueSnackbar('Project deleted successfully', { variant: 'success' });
        navigate('/projects');
      } catch (err) {
        enqueueSnackbar('Failed to delete project', { variant: 'error' });
      }
    }
  };

  // --- Sprint Actions ---
  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!sprintForm.name.trim()) return;
    setSprintSubmitting(true);
    try {
      await sprintApi.createSprint({
        ...sprintForm,
        project_id: parseInt(id)
      });
      enqueueSnackbar('Sprint created successfully', { variant: 'success' });
      setSprintOpen(false);
      setSprintForm({ name: '', start_date: '', end_date: '' });
      fetchSprints();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create sprint', { variant: 'error' });
    } finally {
      setSprintSubmitting(false);
    }
  };

  const handleUpdateSprintStatus = async (sprintId, status) => {
    try {
      await sprintApi.updateSprint(sprintId, { status });
      enqueueSnackbar(`Sprint marked as ${status}`, { variant: 'success' });
      fetchSprints();
    } catch (err) {
      enqueueSnackbar('Failed to update sprint status', { variant: 'error' });
    }
  };

  // --- Member Actions ---
  const handleSearchUsers = async () => {
    if (!memberSearch.trim()) return;
    try {
      const data = await userApi.getAllUsers({ search: memberSearch, limit: 5 });
      setSearchResults(data.users || []);
    } catch (err) {
      enqueueSnackbar('Failed to search users', { variant: 'error' });
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    setAddingMember(true);
    try {
      await projectApi.addMember(id, {
        user_id: selectedUser.id,
        role_in_project: memberRole
      });
      enqueueSnackbar('Member added successfully', { variant: 'success' });
      setSelectedUser(null);
      setMemberSearch('');
      setSearchResults([]);
      fetchMembers();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to add member', { variant: 'error' });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member from the project?')) {
      try {
        await projectApi.removeMember(id, userId);
        enqueueSnackbar('Member removed successfully', { variant: 'success' });
        fetchMembers();
      } catch (err) {
        enqueueSnackbar('Failed to remove member', { variant: 'error' });
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading project details..." />;
  if (!project) return <Typography sx={{ p: 4 }}>Project not found</Typography>;

  return (
    <Box>
      {/* Header Area */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3, background: 'linear-gradient(120deg, #F8FAFC 0%, #E2E8F0 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
              {project.name}
            </Typography>
            <Chip 
              label={project.status.replace('_', ' ')} 
              color="primary" 
              size="small" 
              sx={{ textTransform: 'capitalize', mb: 2 }} 
            />
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
              {project.description || 'No description provided.'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {canManage && (
              <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditOpen(true)}>
                Edit
              </Button>
            )}
            {canDelete && (
              <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteProject}>
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
          <Tab label="Overview" />
          <Tab label="Sprints" />
          <Tab label="Tasks (Board)" />
          <Tab label="Members" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, minHeight: 300 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Project Info</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                  <Typography variant="body1">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Recent Activity</Typography>
                <Typography variant="body2" color="text.secondary">No recent activity logs available.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Team Members ({members.length})</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {members.slice(0, 5).map(m => (
                  <ListItem key={m.id} disableGutters>
                    <ListItemAvatar>
                      <Avatar src={m.profile_picture_url} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`${m.first_name} ${m.last_name}`} 
                      secondary={m.role.toUpperCase()} 
                    />
                  </ListItem>
                ))}
              </List>
              {members.length > 5 && (
                <Button size="small" fullWidth onClick={() => setTabIndex(3)}>
                  View All Members
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Sprints Tab */}
      {tabIndex === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Sprints</Typography>
            {canManage && (
              <Button variant="contained" startIcon={<Add />} onClick={() => setSprintOpen(true)}>
                New Sprint
              </Button>
            )}
          </Box>
          
          {sprints.length === 0 ? (
            <Paper sx={{ p: 6, textCenter: 'center', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="body1" align="center" color="text.secondary">No sprints created yet.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {sprints.map(s => (
                <Grid item xs={12} key={s.id}>
                  <Card>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{s.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {s.start_date ? new Date(s.start_date).toLocaleDateString() : 'N/A'} - {s.end_date ? new Date(s.end_date).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip label={s.status} color={s.status === 'active' ? 'success' : s.status === 'completed' ? 'default' : 'info'} />
                        {canManage && s.status === 'planned' && (
                          <Button size="small" variant="outlined" onClick={() => handleUpdateSprintStatus(s.id, 'active')}>Start</Button>
                        )}
                        {canManage && s.status === 'active' && (
                          <Button size="small" variant="contained" color="success" onClick={() => handleUpdateSprintStatus(s.id, 'completed')}>Complete</Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Tasks Board Tab */}
      {tabIndex === 2 && (
        <Box sx={{ minHeight: 400 }}>
          <KanbanBoard projectId={id} />
        </Box>
      )}

      {/* Members Tab */}
      {tabIndex === 3 && (
        <Box>
          <Grid container spacing={3}>
            {canManage && (
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>Add Member</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Search User Email/Name"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <Button variant="contained" onClick={handleSearchUsers}>Search</Button>
                  </Box>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <List sx={{ maxHeight: 180, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                      {searchResults.map(u => (
                        <ListItem 
                          key={u.id} 
                          button 
                          selected={selectedUser?.id === u.id}
                          onClick={() => setSelectedUser(u)}
                        >
                          <ListItemAvatar>
                            <Avatar src={u.profile_picture_url} />
                          </ListItemAvatar>
                          <ListItemText primary={`${u.first_name} ${u.last_name}`} secondary={u.email} />
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {selectedUser && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="body2">
                        Adding: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel>Project Role</InputLabel>
                        <Select
                          value={memberRole}
                          onChange={(e) => setMemberRole(e.target.value)}
                          label="Project Role"
                        >
                          <MenuItem value="manager">Manager</MenuItem>
                          <MenuItem value="developer">Developer</MenuItem>
                          <MenuItem value="designer">Designer</MenuItem>
                          <MenuItem value="qa">QA</MenuItem>
                        </Select>
                      </FormControl>
                      <Button variant="contained" fullWidth onClick={handleAddMember} disabled={addingMember}>
                        {addingMember ? 'Adding...' : 'Confirm Add'}
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} md={canManage ? 8 : 12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Project Team</Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {members.map(m => (
                    <ListItem key={m.id} divider>
                      <ListItemAvatar>
                        <Avatar src={m.profile_picture_url} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${m.first_name} ${m.last_name}`} 
                        secondary={`${m.email} — Role: ${m.role.toUpperCase()}`} 
                      />
                      {canManage && (
                        <ListItemSecondaryAction>
                          <IconButton edge="end" color="error" onClick={() => handleRemoveMember(m.user_id)}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleEditSubmit}>
          <DialogTitle fontWeight="bold">Edit Project</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={editSubmitting}>
              {editSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Sprint Dialog */}
      <Dialog open={sprintOpen} onClose={() => setSprintOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleCreateSprint}>
          <DialogTitle fontWeight="bold">Create Sprint</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Sprint Name"
              value={sprintForm.name}
              onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Start Date"
              type="date"
              value={sprintForm.start_date}
              onChange={(e) => setSprintForm({ ...sprintForm, start_date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={sprintForm.end_date}
              onChange={(e) => setSprintForm({ ...sprintForm, end_date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSprintOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={sprintSubmitting}>
              {sprintSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectDetailsPage;
