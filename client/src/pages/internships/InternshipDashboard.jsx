import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Tabs, Tab, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  List, ListItem, ListItemText, Card, CardContent, Chip,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { AddBox, TrendingUp, RateReview, AccessTime, People } from '@mui/icons-material';
import { internshipApi } from '../../api/internshipApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

const InternshipDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const authUser = useSelector((state) => state.auth.user);
  const userRole = authUser?.role || authUser?.role_name || 'intern';
  const roleNormalized = userRole.toLowerCase().replace(' ', '_');
  const isStaff = ['admin', 'super_admin', 'mentor', 'placement_coordinator', 'team_lead', 'hr'].includes(roleNormalized);

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');

  // Dynamic Lists State
  const [logs, setLogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  // Log Form State
  const [logOpen, setLogOpen] = useState(false);
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logForm, setLogForm] = useState({
    log_date: new Date().toISOString().split('T')[0],
    activities: '',
    challenges: '',
    learnings: '',
    hours_logged: 8
  });

  useEffect(() => {
    fetchInternships();
  }, [isStaff]);

  const currentInternship = internships.find(i => i.id === selectedInternshipId) || internships[0];

  useEffect(() => {
    if (!currentInternship) return;
    if (tabIndex === 0) {
      fetchLogs(currentInternship.id);
    } else if (tabIndex === 1) {
      fetchFeedback(currentInternship.id);
    } else if (tabIndex === 2) {
      fetchEvaluations(currentInternship.id);
    }
  }, [tabIndex, currentInternship]);

  const fetchInternships = async () => {
    try {
      // Staff (admin/mentor/coordinator) fetch ALL internships
      const data = isStaff
        ? await internshipApi.getAllInternships()
        : await internshipApi.getUserInternships();
      const list = data || [];
      setInternships(list);
      if (list.length > 0) setSelectedInternshipId(list[0].id);
    } catch (err) {
      console.error('Failed to load internships', err);
      enqueueSnackbar('Failed to load internships', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (id) => {
    try {
      const data = await internshipApi.getInternshipLogs(id);
      setLogs(data || []);
    } catch (err) {
      enqueueSnackbar('Failed to load activity logs', { variant: 'error' });
    }
  };

  const fetchFeedback = async (id) => {
    try {
      const data = await internshipApi.getFeedback(id);
      setFeedbacks(data || []);
    } catch (err) {
      enqueueSnackbar('Failed to load mentor feedback', { variant: 'error' });
    }
  };

  const fetchEvaluations = async (id) => {
    try {
      const data = await internshipApi.getEvaluations(id);
      setEvaluations(data || []);
    } catch (err) {
      enqueueSnackbar('Failed to load evaluations', { variant: 'error' });
    }
  };

  const handleOpenLog = () => {
    setLogForm({
      log_date: new Date().toISOString().split('T')[0],
      activities: '',
      challenges: '',
      learnings: '',
      hours_logged: 8
    });
    setLogOpen(true);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.activities.trim()) {
      enqueueSnackbar('Activities summary is required', { variant: 'warning' });
      return;
    }

    setLogSubmitting(true);
    try {
      await internshipApi.addDailyLog(currentInternship.id, {
        ...logForm,
        hours_logged: parseFloat(logForm.hours_logged)
      });
      enqueueSnackbar('Work logged successfully', { variant: 'success' });
      setLogOpen(false);
      fetchLogs(currentInternship.id);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to log work', { variant: 'error' });
    } finally {
      setLogSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading internships..." />;

  if (!currentInternship) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10, p: 4 }}>
        <Paper sx={{ p: 6, maxWidth: 600, mx: 'auto', borderRadius: 3 }}>
          <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {isStaff ? 'No internships found in the system' : 'No active internships found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isStaff
              ? 'No internships have been created yet. Interns will appear here after they are registered.'
              : 'Your assigned internships will appear here once registered by your Placement Coordinator or Admin.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 1 }}>
      {/* Header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {isStaff ? 'All Internships' : 'Internship Tracker'}
        </Typography>

        {/* Staff: internship selector dropdown */}
        {isStaff && internships.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Select Internship</InputLabel>
            <Select
              value={selectedInternshipId}
              label="Select Internship"
              onChange={(e) => { setSelectedInternshipId(e.target.value); setTabIndex(0); }}
            >
              {internships.map(i => (
                <MenuItem key={i.id} value={i.id}>
                  {i.intern_first_name
                    ? `${i.intern_first_name} ${i.intern_last_name || ''} — ${i.title || 'Internship'}`
                    : `${i.title || 'Internship'} @ ${i.company || 'Company'}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Staff info alert */}
      {isStaff && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          Viewing as <strong>{userRole.replace('_', ' ')}</strong> — showing{' '}
          <strong>{internships.length}</strong> internship{internships.length !== 1 ? 's' : ''} in the system.
        </Alert>
      )}

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white' }}>
        <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{currentInternship.title}</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>{currentInternship.company}</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {new Date(currentInternship.start_date).toLocaleDateString()} - {new Date(currentInternship.end_date).toLocaleDateString()}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>Overall Status</Typography>
                <Chip label={currentInternship?.status?.toUpperCase() || 'UNKNOWN'} color="secondary" sx={{ fontWeight: 'bold' }} />
            </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
          <Tab icon={<AddBox sx={{ mr: 1 }}/>} iconPosition="start" label="Daily Logs" />
          <Tab icon={<RateReview sx={{ mr: 1 }}/>} iconPosition="start" label="Mentor Feedback" />
          <Tab icon={<TrendingUp sx={{ mr: 1 }}/>} iconPosition="start" label="Evaluations" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">Daily Activity Logs</Typography>
                  {!isStaff && <Button variant="contained" size="small" onClick={handleOpenLog}>Log Today's Work</Button>}
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {logs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No activities logged yet. Click "Log Today's Work" to begin.</Typography>
              ) : (
                  <List>
                      {logs.map(log => (
                          <ListItem key={log.id} divider alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                              <ListItemText
                                  primary={
                                      <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                                          <Typography variant="subtitle1" fontWeight="bold">
                                              {new Date(log.log_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                          </Typography>
                                          <Chip size="small" icon={<AccessTime />} label={`${log.hours_logged} hrs`} variant="outlined" />
                                      </Box>
                                  }
                                  secondary={
                                      <Box sx={{ mt: 1, color: 'text.primary' }}>
                                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{log.activities}</Typography>
                                          {log.challenges && (
                                              <Box sx={{ mt: 1.5 }}>
                                                  <Typography variant="body2" color="error" fontWeight="bold">Challenges:</Typography>
                                                  <Typography variant="body2" color="text.secondary">{log.challenges}</Typography>
                                              </Box>
                                          )}
                                          {log.learnings && (
                                              <Box sx={{ mt: 1 }}>
                                                  <Typography variant="body2" color="success.main" fontWeight="bold">Learnings:</Typography>
                                                  <Typography variant="body2" color="text.secondary">{log.learnings}</Typography>
                                              </Box>
                                          )}
                                      </Box>
                                  }
                              />
                          </ListItem>
                      ))}
                  </List>
              )}
          </Paper>
      )}

      {tabIndex === 1 && (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Mentor Feedback</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {feedbacks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No feedback records found from your mentor.</Typography>
              ) : (
                  <Grid container spacing={3}>
                      {feedbacks.map(f => (
                          <Grid item xs={12} key={f.id}>
                              <Card variant="outlined">
                                  <CardContent>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                          <Typography variant="subtitle1" fontWeight="bold">
                                              By: {f.mentor_first_name} {f.last_name || 'Mentor'}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                              {new Date(f.created_at).toLocaleDateString()}
                                          </Typography>
                                      </Box>
                                      <Typography variant="body1" sx={{ mb: 2 }}>{f.feedback_text || f.comments}</Typography>
                                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                          <Typography variant="body2" fontWeight="bold">Rating/Score:</Typography>
                                          <Chip label={`${f.rating}/5`} color="primary" size="small" />
                                      </Box>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
              )}
          </Paper>
      )}

      {tabIndex === 2 && (
          <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Weekly Evaluations</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {evaluations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No weekly evaluations logged yet.</Typography>
              ) : (
                  <Grid container spacing={3}>
                      {evaluations.map(ev => (
                          <Grid item xs={12} key={ev.id}>
                              <Card variant="outlined" sx={{ borderLeft: '5px solid', borderColor: 'secondary.main' }}>
                                  <CardContent>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                          <Typography variant="subtitle1" fontWeight="bold">
                                              Week Ending: {new Date(ev.week_end_date || ev.created_at).toLocaleDateString()}
                                          </Typography>
                                          <Chip label={`Grade: ${ev.gpa || ev.score || 'A'}`} color="secondary" />
                                      </Box>
                                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                          {ev.remarks || ev.feedback_summary || 'No detailed remarks provided.'}
                                      </Typography>
                                      <Grid container spacing={2}>
                                          <Grid item xs={4}>
                                              <Typography variant="caption" color="text.secondary">Technical Score</Typography>
                                              <Typography variant="body2" fontWeight="bold">{ev.technical_score || 0}/10</Typography>
                                          </Grid>
                                          <Grid item xs={4}>
                                              <Typography variant="caption" color="text.secondary">Soft Skills Score</Typography>
                                              <Typography variant="body2" fontWeight="bold">{ev.soft_skills_score || 0}/10</Typography>
                                          </Grid>
                                          <Grid item xs={4}>
                                              <Typography variant="caption" color="text.secondary">Attendance</Typography>
                                              <Typography variant="body2" fontWeight="bold">{ev.attendance_percentage || 100}%</Typography>
                                          </Grid>
                                      </Grid>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                  </Grid>
              )}
          </Paper>
      )}

      {/* Log Daily Work Dialog */}
      <Dialog open={logOpen} onClose={() => setLogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleLogSubmit}>
          <DialogTitle fontWeight="bold">Log Daily Work</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Log Date"
                type="date"
                value={logForm.log_date}
                onChange={(e) => setLogForm({ ...logForm, log_date: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Hours Logged"
                type="number"
                inputProps={{ step: 0.5, min: 1, max: 24 }}
                value={logForm.hours_logged}
                onChange={(e) => setLogForm({ ...logForm, hours_logged: e.target.value })}
                fullWidth
                required
              />
            </Box>
            <TextField
              label="Activities Summary"
              placeholder="What tasks or projects did you work on today?"
              value={logForm.activities}
              onChange={(e) => setLogForm({ ...logForm, activities: e.target.value })}
              fullWidth
              required
              multiline
              rows={4}
            />
            <TextField
              label="Challenges (Optional)"
              placeholder="Any issues or blockers you encountered..."
              value={logForm.challenges}
              onChange={(e) => setLogForm({ ...logForm, challenges: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Learnings (Optional)"
              placeholder="Key lessons, skills, or features you learned..."
              value={logForm.learnings}
              onChange={(e) => setLogForm({ ...logForm, learnings: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setLogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={logSubmitting}>
              {logSubmitting ? 'Logging...' : 'Save Log'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default InternshipDashboard;
