import React from 'react';
import { Chip, Box } from '@mui/material';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { PRIORITY, PRIORITY_LABELS, PRIORITY_COLORS } from '../../utils/constants';

const PRIORITY_ICONS = {
  [PRIORITY.CRITICAL]: KeyboardDoubleArrowUpRoundedIcon,
  [PRIORITY.HIGH]:     KeyboardArrowUpRoundedIcon,
  [PRIORITY.MEDIUM]:   DragHandleRoundedIcon,
  [PRIORITY.LOW]:      KeyboardArrowDownRoundedIcon,
};

/**
 * PriorityBadge – colored chip with an icon for task priority.
 *
 * @param {{ priority: string, size?: 'small'|'medium' }} props
 */
const PriorityBadge = ({ priority, size = 'small', ...rest }) => {
  const label = PRIORITY_LABELS[priority] || priority;
  const color = PRIORITY_COLORS[priority] || '#94A3B8';
  const Icon  = PRIORITY_ICONS[priority] || DragHandleRoundedIcon;

  return (
    <Chip
      size={size}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon sx={{ fontSize: 16 }} />
          {label}
        </Box>
      }
      sx={{
        fontWeight: 600,
        color,
        bgcolor: `${color}18`,
        border: `1px solid ${color}40`,
        '& .MuiChip-label': { px: 1 },
      }}
      {...rest}
    />
  );
};

export default PriorityBadge;
