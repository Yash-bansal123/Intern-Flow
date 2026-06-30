import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Avatar, Chip, Divider,
  List, ListItem, ListItemText, CircularProgress, Container, Button,
  LinearProgress, Card, CardContent
} from '@mui/material';
import {
  GitHub, School, Business, Email, Phone, CheckCircle,
  Assignment, Star, Code, ArrowBack, Launch, Share
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { userApi } from '../../api/userApi';
import { githubApi } from '../../api/githubApi';

const lightPortfolioTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5', // Indigo
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06B6D4', // Cyan
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
        },
      },
    },
  },
});

const PortfolioPage = () => {
  const { uuid } = useParams();
  const [data, setData] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchPortfolio();
  }, [uuid]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const portfolioData = await userApi.getPortfolioByUuid(uuid);
      setData(portfolioData);

      if (portfolioData.user?.github_username) {
        fetchGithub(portfolioData.user.github_username);
      }
    } catch (err) {
      console.error(err);
      setError('The requested portfolio could not be found or is inactive.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGithub = async (username) => {
    try {
      setGithubLoading(true);
      const ghStats = await githubApi.getStatsByUsername(username);
      setGithubStats(ghStats);
    } catch (err) {
      console.warn('Could not load github statistics for portfolio', err);
    } finally {
      setGithubLoading(false);
    }
  };

  const getLevelPercentage = (level) => {
    const map = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    return map[level?.toLowerCase()] || 0;
  };

  const getLevelColor = (level) => {
    const map = { beginner: 'info', intermediate: 'primary', advanced: 'warning', expert: 'success' };
    return map[level?.toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc', color: '#0f172a', px: 2 }}>
        <Typography variant="h5" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>{error || 'Portfolio Not Found'}</Typography>
        <Button variant="outlined" component={Link} to="/login" sx={{ color: 'primary.main', borderColor: 'primary.main' }}>
          Back to Login
        </Button>
      </Box>
    );
  }

  const { user, skills, tasks, contributions } = data;

  return (
    <ThemeProvider theme={lightPortfolioTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', color: '#0f172a', py: 6 }}>
        <Container maxWidth="lg">
          {/* Back Link and Copy Share Link Bar */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              component={Link}
              to="/dashboard"
              startIcon={<ArrowBack />}
              sx={{
                color: '#475569',
                fontWeight: 500,
                '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="contained"
              color={copied ? "success" : "primary"}
              startIcon={<Share />}
              onClick={handleCopyLink}
              sx={{
                borderRadius: 2,
                px: 3,
                boxShadow: copied ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {copied ? "Link Copied!" : "Share Portfolio"}
            </Button>
          </Box>

          {/* ── Main Profile Header ── */}
          <Paper
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
              mb: 4,
              bgcolor: '#ffffff'
            }}
          >
            {/* Header Banner */}
            <Box 
              sx={{ 
                height: { xs: 120, md: 160 }, 
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                position: 'relative'
              }}
            />
            {/* Profile Details Container */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: { xs: 'center', md: 'flex-end' }, 
                gap: 3, 
                mt: { xs: -8, md: -10 }, 
                px: { xs: 3, md: 5 }, 
                pb: { xs: 4, md: 5 },
                position: 'relative',
                zIndex: 3
              }}
            >
              <Avatar
                src={user.profile_picture_url}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  bgcolor: 'primary.main',
                  border: '6px solid #ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}
              >
                {user.first_name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#1e1b4b' }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Chip
                    label="Verified Developer Intern"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold', height: 24 }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  {user.department && (
                    <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
                      <Business fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>{user.department}</Typography>
                    </Grid>
                  )}
                  {user.college && (
                    <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
                      <School fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>{user.college}</Typography>
                    </Grid>
                  )}
                  <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
                    <Email fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>{user.email}</Typography>
                  </Grid>
                </Grid>

                {user.bio && (
                  <Box 
                    sx={{ 
                      pl: 2, 
                      borderLeft: '4px solid #6366F1',
                      my: 1.5,
                      maxWidth: '800px',
                      mx: { xs: 'auto', md: '0' },
                      textAlign: 'left'
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#475569',
                        fontStyle: 'italic',
                        lineHeight: 1.6
                      }}
                    >
                      "{user.bio}"
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={4}>
            {/* Left Column: Skills & GitHub */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={4}>
                {/* Skills */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
                      <Code color="primary" /> Core Skills
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: '#e2e8f0' }} />
                    {skills.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {skills.map((skill) => (
                          <Box key={skill.name}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                              <Typography variant="body2" fontWeight="medium">{skill.name}</Typography>
                              <Typography variant="caption" sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
                                {skill.current_level}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={getLevelPercentage(skill.current_level)}
                              color={getLevelColor(skill.current_level)}
                              sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">No verified skills added yet.</Typography>
                    )}
                  </Paper>
                </Grid>

                {/* GitHub */}
                {user.github_username && (
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
                        <GitHub /> GitHub Activity
                      </Typography>
                      <Divider sx={{ mb: 2, borderColor: '#e2e8f0' }} />

                      {githubLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={30} /></Box>
                      ) : githubStats ? (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Avatar src={githubStats.avatarUrl} sx={{ width: 40, height: 40 }} />
                            <Box sx={{ color: '#0f172a' }}>
                              <Typography variant="body1" fontWeight="bold">{githubStats.name}</Typography>
                              <Typography variant="caption" color="text.secondary">@{githubStats.username}</Typography>
                            </Box>
                          </Box>

                          <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                              <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold" color="primary">{githubStats.publicRepos}</Typography>
                                <Typography variant="caption" color="text.secondary">Repositories</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold" color="success.main">{githubStats.commitCount}</Typography>
                                <Typography variant="caption" color="text.secondary">Commits</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold" color="warning.main">{githubStats.prCount}</Typography>
                                <Typography variant="caption" color="text.secondary">PRs Raised</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold" color="secondary">{githubStats.totalStars}</Typography>
                                <Typography variant="caption" color="text.secondary">Stars Received</Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {githubStats.topLanguages?.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Top Languages:</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {githubStats.topLanguages.map(l => (
                                  <Chip key={l} label={l} size="small" variant="outlined" sx={{ color: '#0f172a', borderColor: '#e2e8f0', bgcolor: '#f8fafc' }} />
                                ))}
                              </Box>
                            </Box>
                          )}

                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            startIcon={<Launch />}
                            href={githubStats.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mt: 1, borderColor: '#e2e8f0', color: '#0f172a', '&:hover': { borderColor: '#0f172a', bgcolor: 'rgba(0,0,0,0.02)' } }}
                          >
                            Visit GitHub
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">GitHub account details not available.</Typography>
                      )}
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Right Column: Experience, Achievements & Tasks */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {/* Contributions / AI Resume Points */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: '#0f172a' }}>
                      <Star color="warning" /> Achievements & Contributions
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

                    {contributions.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {contributions.map((c, index) => (
                          <Box key={index}>
                            <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                              <Box sx={{ mr: 2, mt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', bgcolor: 'rgba(245,158,11,0.08)', color: 'warning.main', flexShrink: 0 }}>
                                <Star sx={{ fontSize: 16 }} />
                              </Box>
                              <ListItemText
                                primary={c.contribution_text}
                                primaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 400, lineHeight: 1.6 }}
                              />
                            </ListItem>
                            {index < contributions.length - 1 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                          </Box>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No contribution points generated yet. Generate your resume achievements in the Placement Hub!
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Completed Tasks */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: '#0f172a' }}>
                      <CheckCircle color="success" /> Completed Projects & Tasks
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

                    {tasks.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {tasks.map((task, index) => (
                          <Card key={index} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderRadius: 2 }}>
                            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Assignment color="primary" fontSize="small" />
                                <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                                  {task.title}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.6 }}>
                                {task.description || 'No description provided.'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Completed: {new Date(task.completed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No tasks completed yet.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PortfolioPage;
