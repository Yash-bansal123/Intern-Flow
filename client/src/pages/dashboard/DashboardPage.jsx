import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, useTheme, Chip, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { analyticsApi } from '../../api/analyticsApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { People, Folder, Assignment, School, DateRange, ArrowForward, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Normalise role: handles both 'Admin' (JWT) and 'admin' (legacy) formats
const normaliseRole = (role) => (role || '').toLowerCase().replace(/\s+/g, '_');

const STAFF_ROLES = new Set(['admin', 'super_admin', 'mentor', 'placement_coordinator', 'team_lead', 'hr']);

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalise role regardless of casing from JWT
  const rawRole = user?.role || user?.role_name || '';
  const userRole = normaliseRole(rawRole);
  const isStaff = STAFF_ROLES.has(userRole);

  useEffect(() => {
    fetchDashboardData();
  }, [userRole]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isStaff) {
        const res = await analyticsApi.getSystemOverview();
        setData(res);
      } else {
        const res = await analyticsApi.getUserAnalytics();
        setData(res);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard analytics', err);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return theme.palette.error.main;
      case 'high': return theme.palette.warning.main;
      case 'medium': return theme.palette.info.main;
      default: return theme.palette.success.main;
    }
  };

  if (loading) return <LoadingSpinner message="Generating dashboard metrics..." />;
  if (!data) return <Typography sx={{ p: 4 }}>Error loading dashboard data.</Typography>;

  const CHART_COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];

  // ── STAFF DASHBOARD ──
  if (isStaff) {
    const taskChartData = data.tasks_distribution?.map(t => ({
      name: (t.status || '').replace(/_/g, ' ').toUpperCase(),
      count: parseInt(t.count) || 0,
    })) || [];

    return (
      <Box sx={{ p: 1 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome, {user?.first_name || 'Admin'} 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              System overview · Logged in as{' '}
              <Chip
                label={rawRole}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: 0.5, height: 20, fontSize: '0.7rem' }}
              />
            </Typography>
          </Box>
          <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.light', opacity: 0.4 }} />
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Users', value: data.users ?? 0, icon: <People />, color: 'primary' },
            { label: 'Active Projects', value: data.projects ?? 0, icon: <Folder />, color: 'success' },
            { label: 'Total Internships', value: data.internships ?? 0, icon: <School />, color: 'secondary' },
          ].map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${stat.color}.light`, color: `${stat.color}.main`, mr: 2, display: 'flex' }}>
                  {stat.icon}
                </Box>
                <CardContent sx={{ p: '16px !important' }}>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                  <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts & Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>System-wide Task Distribution</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                {taskChartData.length === 0 ? (
                  <Typography align="center" color="text.secondary" sx={{ pt: 10 }}>No tasks logged in system</Typography>
                ) : (
                  <ResponsiveContainer>
                    <BarChart data={taskChartData}>
                      <XAxis dataKey="name" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {taskChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" startIcon={<Folder />} fullWidth onClick={() => navigate('/projects')}>
                  Manage Projects
                </Button>
                <Button variant="outlined" startIcon={<School />} fullWidth onClick={() => navigate('/internship')}>
                  View All Interns
                </Button>
                <Button variant="outlined" startIcon={<Assignment />} fullWidth onClick={() => navigate('/tasks')}>
                  Task Board
                </Button>
                {(userRole === 'placement_coordinator' || userRole === 'admin' || userRole === 'super_admin') && (
                  <Button variant="outlined" startIcon={<DateRange />} fullWidth onClick={() => navigate('/placement')}>
                    Placement Hub
                  </Button>
                )}
                <Button variant="outlined" startIcon={<People />} fullWidth onClick={() => navigate('/reports')}>
                  Reports & Analytics
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // ── STUDENT / INTERN DASHBOARD ──
  const studentTasksCount = data.tasks_distribution?.reduce((acc, curr) => acc + (parseInt(curr.count) || 0), 0) || 0;
  const completedTasks = data.tasks_distribution?.find(t => t.status === 'done')?.count || 0;

  const skillChartData = data.skills?.map(s => {
    const map = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    return { name: s.name, level: map[s.current_level] || 25 };
  }) || [];

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {user?.first_name || 'Intern'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your internship progress summary.
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('/tasks')}>
          My Tasks Board
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Assigned Tasks', value: studentTasksCount, icon: <Assignment />, color: 'primary' },
          { label: 'Completed Tasks', value: `${completedTasks} / ${studentTasksCount}`, icon: <Assignment />, color: 'success' },
          { label: 'Skills Tracked', value: data.skills?.length || 0, icon: <School />, color: 'secondary' },
        ].map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${stat.color}.light`, color: `${stat.color}.main`, mr: 2, display: 'flex' }}>
                {stat.icon}
              </Box>
              <CardContent sx={{ p: '16px !important' }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Mock Interviews */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>My Skills Matrix</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              {skillChartData.length === 0 ? (
                <Typography align="center" color="text.secondary" sx={{ pt: 10 }}>
                  No skills tracked yet.{' '}
                  <span
                    style={{ cursor: 'pointer', color: theme.palette.primary.main, textDecoration: 'underline' }}
                    onClick={() => navigate('/analytics')}
                  >
                    Add skills here.
                  </span>
                </Typography>
              ) : (
                <ResponsiveContainer>
                  <BarChart data={skillChartData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} width={120} />
                    <Tooltip formatter={(value) => `${value}% proficiency`} />
                    <Bar dataKey="level" fill={theme.palette.secondary.main} radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Mock Interviews Prep</Typography>
            <Divider sx={{ mb: 2 }} />
            {!data.mock_interviews || data.mock_interviews.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ pt: 6 }}>No scheduled mock interviews.</Typography>
            ) : (
              <List sx={{ overflowY: 'auto', flexGrow: 1, maxHeight: 220 }}>
                {data.mock_interviews.map((mi, idx) => (
                  <ListItem key={idx} divider={idx < data.mock_interviews.length - 1} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                            {mi.type} Interview
                          </Typography>
                          <Chip label={(mi.status || 'scheduled').toUpperCase()} size="small" color={mi.status === 'completed' ? 'success' : 'info'} variant="outlined" />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {mi.interview_date ? new Date(mi.interview_date).toLocaleDateString() : 'TBD'}
                          </Typography>
                          {mi.score && (
                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                              Score: {mi.score}/100
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Button variant="outlined" fullWidth onClick={() => navigate('/placement')} sx={{ mt: 'auto', pt: 1 }}>
              Go to Placement Hub
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
