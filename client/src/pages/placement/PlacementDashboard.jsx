import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Paper, Grid, Button, Divider, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, List, ListItem, ListItemText, Chip, MenuItem, FormControl, InputLabel, Select,
  CircularProgress
} from '@mui/material';
import { Code, Assessment, Build, Add, CheckCircle, Launch } from '@mui/icons-material';
import { placementApi } from '../../api/placementApi';
import { resumeApi } from '../../api/resumeApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

const PlacementDashboard = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [progress, setProgress] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [skillsMatrix, setSkillsMatrix] = useState([]);
  const [topInterns, setTopInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressForm, setProgressForm] = useState({
    dsa_easy_count: 0,
    dsa_medium_count: 0,
    dsa_hard_count: 0
  });
  const [progressSubmitting, setProgressSubmitting] = useState(false);

  const [interviewOpen, setInterviewOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interviewer_id: '',
    student_id: '',
    interview_type: 'technical',
    scheduled_at: new Date().toISOString().split('T')[0]
  });
  const [interviewSubmitting, setInterviewSubmitting] = useState(false);

  const [completeOpen, setCompleteOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [completeForm, setCompleteForm] = useState({
    score: 75,
    strengths: '',
    improvements: '',
    overall_feedback: '',
    status: 'completed'
  });
  const [completeSubmitting, setCompleteSubmitting] = useState(false);

  const userRole = user?.role || user?.role_name || '';
  const roleNorm = userRole.toLowerCase().replace(/\s+/g, '_');
  const isStaff = ['admin', 'super_admin', 'mentor', 'placement_coordinator', 'team_lead'].includes(roleNorm);

  const [generatingResume, setGeneratingResume] = useState(false);

  const calculateReadinessScore = () => {
    if (isStaff) return 0;
    
    // 1. DSA points (Max 40 points)
    const easyCount = progress?.dsa_easy_count || 0;
    const mediumCount = progress?.dsa_medium_count || 0;
    const hardCount = progress?.dsa_hard_count || 0;
    const dsaPoints = Math.min(40, (easyCount * 0.5) + (mediumCount * 1.5) + (hardCount * 3.0));
    
    // 2. Mock Interviews points (Max 40 points)
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    let interviewPoints = 0;
    if (completedInterviews.length > 0) {
      const avgScore = completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / completedInterviews.length;
      interviewPoints = (avgScore / 100) * 40;
    }
    
    // 3. Task completion points (Max 20 points)
    const taskPoints = Math.min(20, contributions.length * 4); // 4 points per contribution/completed task
    
    return Math.min(100, Math.round(dsaPoints + interviewPoints + taskPoints));
  };

  const readinessScore = calculateReadinessScore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pData = await placementApi.getProgress();
      const rData = await resumeApi.getContributions();
      const iData = await placementApi.getInterviews();
      
      setProgress(pData);
      setContributions(rData || []);
      setInterviews(iData || []);
      
      // Fetch all authorized users as potential interviewers (all roles except student/intern)
      const usersRes = await userApi.getAllUsers({ limit: 200 });
      const allUsers = usersRes.users || usersRes || [];
      const authorizedInterviewers = allUsers.filter(u => {
          const r = (u.role_name || u.role || '').toLowerCase().trim();
          return r && r !== 'student' && r !== 'intern';
      });
      setInterviewers(authorizedInterviewers);
      if (isStaff) {
          // Fetch students list for coordinator scheduling
          const studentsRes = await userApi.getAllUsers({ limit: 200 });
          const studs = (studentsRes.users || studentsRes || []).filter(u => {
              const r = (u.role_name || u.role || '').toLowerCase();
              return r === 'student';
          });
          setStudentsList(studs);
          const matrixData = await placementApi.getInternSkillsMatrix();
          setSkillsMatrix(matrixData || []);
          
          const topInternsData = await placementApi.getTopInterns();
          setTopInterns(topInternsData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProgress = () => {
    setProgressForm({
      dsa_easy_count: progress?.dsa_easy_count || 0,
      dsa_medium_count: progress?.dsa_medium_count || 0,
      dsa_hard_count: progress?.dsa_hard_count || 0
    });
    setProgressOpen(true);
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    setProgressSubmitting(true);
    try {
      await placementApi.updateProgress({
        dsa_easy_count: parseInt(progressForm.dsa_easy_count) || 0,
        dsa_medium_count: parseInt(progressForm.dsa_medium_count) || 0,
        dsa_hard_count: parseInt(progressForm.dsa_hard_count) || 0
      });
      enqueueSnackbar('DSA progress updated successfully', { variant: 'success' });
      setProgressOpen(false);
      fetchData();
    } catch (err) {
      enqueueSnackbar('Failed to update DSA progress', { variant: 'error' });
    } finally {
      setProgressSubmitting(false);
    }
  };

  const handleGenerateResume = async () => {
    setGeneratingResume(true);
    try {
      const result = await resumeApi.generateAllContributions();
      if (result.data?.generatedCount > 0) {
        enqueueSnackbar(`Successfully generated ${result.data.generatedCount} new resume points!`, { variant: 'success' });
        // Refresh contributions
        const rData = await resumeApi.getContributions();
        setContributions(rData || []);
      } else {
        enqueueSnackbar('No new completed tasks to generate points for.', { variant: 'info' });
      }
    } catch (err) {
      enqueueSnackbar('Failed to generate resume points', { variant: 'error' });
    } finally {
      setGeneratingResume(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      enqueueSnackbar('File size exceeds 10MB limit', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      enqueueSnackbar('Uploading resume...', { variant: 'info' });
      await placementApi.uploadResume(formData);
      enqueueSnackbar('Resume uploaded successfully!', { variant: 'success' });
      fetchData();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to upload resume', { variant: 'error' });
    }
  };

  const handleOpenInterview = () => {
    setInterviewForm({
      interviewer_id: interviewers[0]?.id || '',
      student_id: studentsList[0]?.id || '',
      interview_type: 'technical',
      scheduled_at: new Date().toISOString().split('T')[0]
    });
    setInterviewOpen(true);
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewForm.interviewer_id) {
      enqueueSnackbar('Please select an interviewer', { variant: 'warning' });
      return;
    }
    if (isStaff && !interviewForm.student_id) {
      enqueueSnackbar('Please select a student', { variant: 'warning' });
      return;
    }
    setInterviewSubmitting(true);
    try {
      // Staff schedule for a specific student; students schedule for themselves
      const targetUserId = isStaff ? interviewForm.student_id : 'me';
      await placementApi.scheduleInterview(targetUserId, {
        interviewer_id: parseInt(interviewForm.interviewer_id),
        interview_type: interviewForm.interview_type,
        scheduled_at: interviewForm.scheduled_at
      });
      enqueueSnackbar('Mock interview scheduled successfully', { variant: 'success' });
      setInterviewOpen(false);
      fetchData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to schedule interview', { variant: 'error' });
    } finally {
      setInterviewSubmitting(false);
    }
  };

  const handleOpenComplete = (interview) => {
    setSelectedInterview(interview);
    setCompleteForm({
      score: 75,
      strengths: '',
      improvements: '',
      overall_feedback: '',
      status: 'completed'
    });
    setCompleteOpen(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completeForm.overall_feedback.trim()) {
      enqueueSnackbar('Overall feedback is required', { variant: 'warning' });
      return;
    }
    setCompleteSubmitting(true);
    try {
      await placementApi.completeInterview(selectedInterview.id, {
        ...completeForm,
        score: parseInt(completeForm.score)
      });
      enqueueSnackbar('Interview evaluation saved successfully', { variant: 'success' });
      setCompleteOpen(false);
      fetchData();
    } catch (err) {
      enqueueSnackbar('Failed to save evaluation', { variant: 'error' });
    } finally {
      setCompleteSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading placement data..." />;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Placement & Resume Builder
        </Typography>
        {!isStaff && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/portfolio/${user?.uuid}`}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Launch />}
            sx={{ borderRadius: 2 }}
          >
            View My Portfolio
          </Button>
        )}
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Top Performers (Staff Only) or DSA Tracker (Student Only) */}
        <Grid item xs={12} md={4}>
            {isStaff ? (
                <Paper sx={{ p: 3, borderRadius: 3, height: '100%', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Assessment sx={{ mr: 2, color: '#38BDF8' }} />
                        <Typography variant="h6" fontWeight="bold">Top Interns Leaderboard</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                        Based on DSA problem counts and Mock Interview scores.
                    </Typography>
                    <List disablePadding>
                        {topInterns.map((intern, index) => (
                            <ListItem key={intern.id} sx={{ px: 0, py: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="bold">{index + 1}. {intern.first_name} {intern.last_name}</Typography>}
                                    secondary={
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            DSA Score: <span style={{ color: '#4ADE80' }}>{intern.dsa_score}</span> | 
                                            Interview Avg: <span style={{ color: '#FACC15' }}>{Number(intern.avg_interview_score || 0).toFixed(1)}/100</span>
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                        {topInterns.length === 0 && (
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>No intern data available.</Typography>
                        )}
                    </List>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* circular progress score */}
                    <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Readiness Score</Typography>
                        
                        <Box sx={{ position: 'relative', display: 'inline-flex', my: 1 }}>
                            <CircularProgress
                                variant="determinate"
                                value={readinessScore}
                                size={110}
                                thickness={6}
                                sx={{ color: '#4ADE80', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
                            />
                            <Box
                                  sx={{
                                      top: 0, left: 0, bottom: 0, right: 0,
                                      position: 'absolute', display: 'flex',
                                      alignItems: 'center', justifyContent: 'center',
                                      flexDirection: 'column'
                                  }}
                            >
                                <Typography variant="h4" component="div" fontWeight="bold">
                                    {readinessScore}%
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, px: 1 }}>
                            Calculated from solved DSA, mock interviews, and completed tasks.
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Code sx={{ mr: 2, color: '#38BDF8' }} />
                        <Typography variant="h6" fontWeight="bold">DSA Progress</Typography>
                    </Box>
                    <Grid container spacing={1.5} sx={{ mb: 3 }}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.5 }}>Easy</Typography>
                          <Typography variant="h5" fontWeight="bold" color="#4ADE80">{progress?.dsa_easy_count || 0}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.5 }}>Medium</Typography>
                          <Typography variant="h5" fontWeight="bold" color="#FACC15">{progress?.dsa_medium_count || 0}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.5 }}>Hard</Typography>
                          <Typography variant="h5" fontWeight="bold" color="#F87171">{progress?.dsa_hard_count || 0}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Button 
                      variant="outlined" 
                      sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white' } }} 
                      fullWidth
                      onClick={handleOpenProgress}
                    >
                        Update Progress
                    </Button>
                </Paper>
                </Box>
            )}
        </Grid>

        {/* Mock Interviews */}
        <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="bold">Mock Interviews</Typography>
                    </Box>
                    {isStaff && (
                      <Button size="small" variant="contained" startIcon={<Add />} onClick={handleOpenInterview}>
                        Schedule Mock
                      </Button>
                    )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {interviews.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6, my: 'auto' }}>
                        No mock interviews scheduled yet.
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {interviews.map(mi => (
                            <ListItem key={mi.id} divider alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                {mi.type} Interview
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Chip 
                                                  label={mi.status.toUpperCase()} 
                                                  color={mi.status === 'completed' ? 'success' : 'info'} 
                                                  size="small" 
                                                />
                                                {isStaff && mi.status === 'scheduled' && (
                                                    <Button 
                                                      size="small" 
                                                      variant="outlined" 
                                                      startIcon={<CheckCircle />} 
                                                      onClick={() => handleOpenComplete(mi)}
                                                    >
                                                        Evaluate
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2">
                                                Interviewer: <strong>{mi.interviewer_first_name} {mi.interviewer_last_name}</strong>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Scheduled Date: {new Date(mi.interview_date).toLocaleDateString()}
                                            </Typography>
                                            {mi.score !== null && (
                                                <Box sx={{ mt: 1, bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                                                    <Typography variant="body2" fontWeight="bold" color="primary">Score: {mi.score}/100</Typography>
                                                    <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Feedback:</strong> {mi.overall_feedback}</Typography>
                                                    {mi.strengths && <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Strengths:</strong> {mi.strengths}</Typography>}
                                                    {mi.improvements && <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Improvements:</strong> {mi.improvements}</Typography>}
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
        </Grid>

        {/* Staff Only: Intern Skills Matrix */}
        {isStaff && (
        <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Intern Skills Matrix (Evidence-Based)</Typography>
                {skillsMatrix.length === 0 ? (
                    <Typography color="text.secondary">No interns found or no skills recorded.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {skillsMatrix.map(intern => (
                            <Grid item xs={12} md={6} key={intern.id}>
                                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">{intern.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{intern.department} | {intern.email}</Typography>
                                        </Box>
                                        {intern.resume_url && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Launch />}
                                                href={`http://localhost:5000${intern.resume_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ py: 0.2, fontSize: '0.75rem', borderRadius: 1.5 }}
                                            >
                                                Resume
                                            </Button>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {intern.skills?.length > 0 ? intern.skills.map((s, idx) => (
                                            <Chip 
                                                key={idx} 
                                                label={`${s.name} - ${s.current_level}`} 
                                                color={s.current_level === 'expert' ? 'success' : s.current_level === 'advanced' ? 'primary' : 'default'}
                                                size="small" 
                                            />
                                        )) : <Typography variant="caption" color="text.secondary">No verified skills yet</Typography>}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Grid>
        )}

        {/* Resume Generator */}
        <Grid item xs={12}>
             <Paper sx={{ p: 4, borderRadius: 3 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Build sx={{ mr: 2, color: 'secondary.main' }} />
                      <Typography variant="h5" fontWeight="bold">Auto-Resume Contributions</Typography>
                    </Box>
                    {!isStaff && (
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        size="small" 
                        onClick={handleGenerateResume}
                        disabled={generatingResume}
                      >
                        {generatingResume ? 'Generating...' : 'Generate AI Points'}
                      </Button>
                    )}
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    InternFlow analyzes the tasks you've completed and automatically generates professional resume bullet points.
                </Typography>

                {!isStaff && (
                    <Box sx={{ mb: 4, p: 3, borderRadius: 2, bgcolor: 'action.hover', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Resume PDF/Word Upload</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Upload your updated resume so coordinators can review it for active placement cycles.
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<Add />}
                                size="small"
                                sx={{ borderRadius: 1.5 }}
                            >
                                Select File
                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                />
                            </Button>
                            {progress?.resume_url ? (
                                <Button
                                    variant="text"
                                    color="primary"
                                    href={`http://localhost:5000${progress.resume_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<Launch />}
                                    size="small"
                                >
                                    View Uploaded Resume
                                </Button>
                            ) : (
                                <Typography variant="caption" color="text.secondary">No file uploaded yet</Typography>
                            )}
                            {progress?.resume_status && (
                                <Chip 
                                    label={`Status: ${progress.resume_status.toUpperCase()}`}
                                    color={progress.resume_status === 'approved' ? 'success' : progress.resume_status === 'review' ? 'warning' : 'default'}
                                    size="small"
                                />
                            )}
                        </Box>
                    </Box>
                )}
                
                {contributions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.default', borderRadius: 2 }}>
                         <Typography variant="body2" color="text.secondary">
                            Complete some tasks to see auto-generated resume points here.
                         </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {contributions.map((c) => (
                            <Paper variant="outlined" key={c.id} sx={{ p: 2, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'primary.main' }}>•</Typography>
                                    <Box>
                                        <Typography variant="body1" fontWeight="500">{c.contribution_text}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Auto-compiled from completed Task: <strong>{c.task_title}</strong>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
             </Paper>
         </Grid>
      </Grid>

      {/* DSA Update Dialog */}
      <Dialog open={progressOpen} onClose={() => setProgressOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleProgressSubmit}>
          <DialogTitle fontWeight="bold">Update DSA Solved Count</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Easy Problems"
              type="number"
              value={progressForm.dsa_easy_count}
              onChange={(e) => setProgressForm({ ...progressForm, dsa_easy_count: e.target.value })}
              fullWidth
            />
            <TextField
              label="Medium Problems"
              type="number"
              value={progressForm.dsa_medium_count}
              onChange={(e) => setProgressForm({ ...progressForm, dsa_medium_count: e.target.value })}
              fullWidth
            />
            <TextField
              label="Hard Problems"
              type="number"
              value={progressForm.dsa_hard_count}
              onChange={(e) => setProgressForm({ ...progressForm, dsa_hard_count: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setProgressOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={progressSubmitting}>
              {progressSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={interviewOpen} onClose={() => setInterviewOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleInterviewSubmit}>
          <DialogTitle fontWeight="bold">Schedule Mock Interview</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Staff: pick student to schedule interview for */}
            {isStaff && (
              <FormControl fullWidth required>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={interviewForm.student_id}
                  onChange={(e) => setInterviewForm({ ...interviewForm, student_id: e.target.value })}
                  label="Select Student"
                >
                  {studentsList.map(s => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} — {s.email}
                    </MenuItem>
                  ))}
                  {studentsList.length === 0 && <MenuItem disabled>No students found</MenuItem>}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth required>
              <InputLabel>Select Interviewer</InputLabel>
              <Select
                value={interviewForm.interviewer_id}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewer_id: e.target.value })}
                label="Select Interviewer"
              >
                {interviewers.map(i => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.first_name} {i.last_name} ({i.role_name.replace('_', ' ')})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Interview Type</InputLabel>
              <Select
                value={interviewForm.interview_type}
                onChange={(e) => setInterviewForm({ ...interviewForm, interview_type: e.target.value })}
                label="Interview Type"
              >
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="system_design">System Design</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Scheduled Date"
              type="date"
              value={interviewForm.scheduled_at}
              onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_at: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setInterviewOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={interviewSubmitting}>
              {interviewSubmitting ? 'Schedule' : 'Schedule'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Evaluate Interview Dialog */}
      <Dialog open={completeOpen} onClose={() => setCompleteOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCompleteSubmit}>
          <DialogTitle fontWeight="bold">Evaluate Mock Interview</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Score (out of 100)"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              value={completeForm.score}
              onChange={(e) => setCompleteForm({ ...completeForm, score: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Overall Feedback"
              value={completeForm.overall_feedback}
              onChange={(e) => setCompleteForm({ ...completeForm, overall_feedback: e.target.value })}
              fullWidth
              required
              multiline
              rows={3}
            />
            <TextField
              label="Strengths"
              value={completeForm.strengths}
              onChange={(e) => setCompleteForm({ ...completeForm, strengths: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Areas of Improvement"
              value={completeForm.improvements}
              onChange={(e) => setCompleteForm({ ...completeForm, improvements: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={completeSubmitting}>
              {completeSubmitting ? 'Saving...' : 'Submit Evaluation'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PlacementDashboard;
