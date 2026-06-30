import React from 'react';
import { Chip } from '@mui/material';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, PROJECT_STATUS_LABELS, SPRINT_STATUS_LABELS } from '../../utils/constants';

/**
 * StatusBadge – colored chip for task / project / sprint status.
 *
 * @param {{ status: string, type?: 'task'|'project'|'sprint', size?: 'small'|'medium' }} props
 */
const StatusBadge = ({ status, type = 'task', size = 'small', ...rest }) => {
  const labelsMap = {
    task:    TASK_STATUS_LABELS,
    project: PROJECT_STATUS_LABELS,
    sprint:  SPRINT_STATUS_LABELS,
  };

  const label = labelsMap[type]?.[status] || status;
  const color = TASK_STATUS_COLORS[status] || 'default';

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="filled"
      sx={{
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'capitalize',
      }}
      {...rest}
    />
  );
};

export default StatusBadge;
