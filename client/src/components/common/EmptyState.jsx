import React from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

/**
 * EmptyState – placeholder for empty lists.
 *
 * @param {{
 *   icon?: React.ReactNode,
 *   title?: string,
 *   message?: string,
 *   actionLabel?: string,
 *   onAction?: () => void,
 * }} props
 */
const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  message = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) => {
  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          px: 4,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.1)'
                : 'rgba(99, 102, 241, 0.06)',
            mb: 3,
          }}
        >
          {icon || (
            <InboxRoundedIcon
              sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }}
            />
          )}
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360, mb: actionLabel ? 3 : 0 }}
        >
          {message}
        </Typography>

        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </Fade>
  );
};

export default EmptyState;
