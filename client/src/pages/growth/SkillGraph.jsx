import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, LinearProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, IconButton
} from '@mui/material';
import { skillApi } from '../../api/skillApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Add, TrendingUp, Verified } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const getLevelValue = (level) => {
    switch(level) {
        case 'beginner': return 25;
        case 'intermediate': return 50;
        case 'advanced': return 75;
        case 'expert': return 100;
        default: return 0;
    }
};

const getLevelColor = (level) => {
    switch(level) {
        case 'beginner': return 'info';
        case 'intermediate': return 'primary';
        case 'advanced': return 'success';
        case 'expert': return 'secondary';
        default: return 'default';
    }
};

const SkillGraph = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [skills, setSkills] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Skill Modal State
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    skill_id: '',
    current_level: 'beginner'
  });
  const [adding, setAdding] = useState(false);

  // Update Skill Level Modal State
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [newLevel, setNewLevel] = useState('intermediate');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchMasterSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillApi.getUserSkills();
      setSkills(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterSkills = async () => {
    try {
      const data = await skillApi.getMasterSkills();
      setMasterSkills(data || []);
    } catch (err) {
      console.error('Failed to load master skills', err);
    }
  };

  const handleOpenAdd = () => {
    setAddForm({
      skill_id: '',
      current_level: 'beginner'
    });
    setAddOpen(true);
  };

  const handleOpenUpdate = (skill) => {
    setSelectedSkill(skill);
    setNewLevel(skill.current_level);
    setUpdateOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.skill_id) {
      enqueueSnackbar('Please select a skill', { variant: 'warning' });
      return;
    }

    setAdding(true);
    try {
      await skillApi.addUserSkill(addForm);
      enqueueSnackbar('Skill added successfully', { variant: 'success' });
      setAddOpen(false);
      fetchSkills();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to add skill', { variant: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill) return;

    if (newLevel === selectedSkill.current_level) {
      enqueueSnackbar('Please select a different level', { variant: 'warning' });
      return;
    }

    setUpdating(true);
    try {
      await skillApi.updateProgress({
        user_skill_id: selectedSkill.user_skill_id,
        previous_level: selectedSkill.current_level,
        new_level: newLevel,
        justification_task_id: null
      });
      enqueueSnackbar('Skill level updated successfully', { variant: 'success' });
      setUpdateOpen(false);
      fetchSkills();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update skill', { variant: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  // Filter out master skills that user already has added
  const availableMasterSkills = masterSkills.filter(
    ms => !skills.some(us => us.skill_id === ms.id)
  );

  if (loading) return <LoadingSpinner message="Loading your skills..." />;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Skill Matrix & Progression
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
          Add Skill
        </Button>
      </Box>

      {skills.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>No skills tracked yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Start adding skills to track your growth during the internship.</Typography>
              <Button variant="outlined" startIcon={<Add />} onClick={handleOpenAdd}>Add Your First Skill</Button>
          </Paper>
      ) : (
          <Grid container spacing={3}>
              {skills.map(skill => (
                  <Grid item xs={12} md={6} key={skill.user_skill_id}>
                      <Paper sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pr: 8 }}>
                              <Typography variant="h6" fontWeight="bold">{skill.name}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  {skill.is_verified ? (
                                      <Chip 
                                        icon={<Verified sx={{ fontSize: '0.9rem !important' }} />}
                                        label="Verified" 
                                        color="success" 
                                        size="small" 
                                        variant="outlined"
                                      />
                                  ) : null}
                                  <Chip 
                                    label={skill.current_level} 
                                    color={getLevelColor(skill.current_level)} 
                                    size="small" 
                                    sx={{ textTransform: 'capitalize' }}
                                  />
                              </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {skill.category}
                          </Typography>
                          <Box sx={{ mt: 3 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={getLevelValue(skill.current_level)} 
                                color={getLevelColor(skill.current_level)}
                                sx={{ height: 8, borderRadius: 4 }} 
                              />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">Beginner</Typography>
                                  <Typography variant="caption" color="text.secondary">Expert</Typography>
                              </Box>
                          </Box>
                          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleOpenUpdate(skill)}
                                title="Update progression level"
                              >
                                  <TrendingUp />
                              </IconButton>
                          </Box>
                      </Paper>
                  </Grid>
              ))}
          </Grid>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleAddSubmit}>
          <DialogTitle fontWeight="bold">Add Skill to Track</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Select Skill</InputLabel>
              <Select
                value={addForm.skill_id}
                onChange={(e) => setAddForm({ ...addForm, skill_id: e.target.value })}
                label="Select Skill"
              >
                {availableMasterSkills.length === 0 ? (
                  <MenuItem value="" disabled>No new skills available</MenuItem>
                ) : (
                  availableMasterSkills.map(ms => (
                    <MenuItem key={ms.id} value={ms.id}>
                      {ms.name} ({ms.category})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Current Level</InputLabel>
              <Select
                value={addForm.current_level}
                onChange={(e) => setAddForm({ ...addForm, current_level: e.target.value })}
                label="Current Level"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={adding || availableMasterSkills.length === 0}>
              {adding ? 'Adding...' : 'Add Skill'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Skill Level Dialog */}
      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleUpdateSubmit}>
          <DialogTitle fontWeight="bold">Update Skill Level</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {selectedSkill && (
              <Box>
                <Typography variant="body1">
                  Updating level for: <strong>{selectedSkill.name}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current level: {selectedSkill.current_level.toUpperCase()}
                </Typography>
              </Box>
            )}
            <FormControl fullWidth required>
              <InputLabel>New Level</InputLabel>
              <Select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                label="New Level"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={updating}>
              {updating ? 'Updating...' : 'Update Level'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SkillGraph;
