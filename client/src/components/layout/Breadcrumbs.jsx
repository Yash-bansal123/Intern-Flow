import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

// Human-readable labels for route segments
const SEGMENT_LABELS = {
  dashboard:    'Dashboard',
  projects:     'Projects',
  tasks:        'My Tasks',
  sprints:      'Sprints',
  kanban:       'Kanban Board',
  skills:       'Skills',
  internship:   'Internship',
  placement:    'Placement',
  analytics:    'Analytics',
  resume:       'Resume Builder',
  profile:      'Profile',
  admin:        'Admin',
  settings:     'Settings',
  'new':        'Create New',
  edit:         'Edit',
};

/**
 * Breadcrumbs – auto-generated from the current React Router location.
 */
const Breadcrumbs = () => {
  const location   = useLocation();
  const pathnames  = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) return null;

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
      sx={{
        '& .MuiBreadcrumbs-li': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
    >
      {/* Home link */}
      <Link
        component={RouterLink}
        to="/dashboard"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': { color: 'primary.main' },
          transition: 'color 0.2s',
        }}
      >
        <HomeRoundedIcon sx={{ fontSize: 18 }} />
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo   = '/' + pathnames.slice(0, index + 1).join('/');
        const isLast    = index === pathnames.length - 1;
        const label     = SEGMENT_LABELS[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        return isLast ? (
          <Typography
            key={routeTo}
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ textTransform: 'capitalize' }}
          >
            {label}
          </Typography>
        ) : (
          <Link
            key={routeTo}
            component={RouterLink}
            to={routeTo}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
