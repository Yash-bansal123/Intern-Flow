// ─── Task Statuses ────────────────────────────────────────────────
export const TASK_STATUS = {
  TODO:        'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW:   'in_review',
  DONE:        'done',
  BLOCKED:     'blocked',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]:        'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.IN_REVIEW]:   'In Review',
  [TASK_STATUS.DONE]:        'Done',
  [TASK_STATUS.BLOCKED]:     'Blocked',
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]:        'default',
  [TASK_STATUS.IN_PROGRESS]: 'info',
  [TASK_STATUS.IN_REVIEW]:   'warning',
  [TASK_STATUS.DONE]:        'success',
  [TASK_STATUS.BLOCKED]:     'error',
};

// ─── Priorities ───────────────────────────────────────────────────
export const PRIORITY = {
  CRITICAL: 'critical',
  HIGH:     'high',
  MEDIUM:   'medium',
  LOW:      'low',
};

export const PRIORITY_LABELS = {
  [PRIORITY.CRITICAL]: 'Critical',
  [PRIORITY.HIGH]:     'High',
  [PRIORITY.MEDIUM]:   'Medium',
  [PRIORITY.LOW]:      'Low',
};

export const PRIORITY_COLORS = {
  [PRIORITY.CRITICAL]: '#EF4444',
  [PRIORITY.HIGH]:     '#F59E0B',
  [PRIORITY.MEDIUM]:   '#3B82F6',
  [PRIORITY.LOW]:      '#10B981',
};

// ─── Roles ────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN:                 'admin',
  PLACEMENT_COORDINATOR: 'placement_coordinator',
  MENTOR:                'mentor',
  TEAM_LEAD:             'team_lead',
  STUDENT:               'student',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]:                 'Admin',
  [ROLES.PLACEMENT_COORDINATOR]: 'Placement Coordinator',
  [ROLES.MENTOR]:                'Mentor',
  [ROLES.TEAM_LEAD]:             'Team Lead',
  [ROLES.STUDENT]:               'Student',
};

export const ROLE_HIERARCHY = [
  ROLES.ADMIN,
  ROLES.PLACEMENT_COORDINATOR,
  ROLES.MENTOR,
  ROLES.TEAM_LEAD,
  ROLES.STUDENT
];

// ─── Skill Levels ─────────────────────────────────────────────────
export const SKILL_LEVELS = {
  BEGINNER:     'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED:     'advanced',
  EXPERT:       'expert',
};

export const SKILL_LEVEL_LABELS = {
  [SKILL_LEVELS.BEGINNER]:     'Beginner',
  [SKILL_LEVELS.INTERMEDIATE]: 'Intermediate',
  [SKILL_LEVELS.ADVANCED]:     'Advanced',
  [SKILL_LEVELS.EXPERT]:       'Expert',
};

export const SKILL_LEVEL_VALUES = {
  [SKILL_LEVELS.BEGINNER]:     1,
  [SKILL_LEVELS.INTERMEDIATE]: 2,
  [SKILL_LEVELS.ADVANCED]:     3,
  [SKILL_LEVELS.EXPERT]:       4,
};

// ─── Sprint Status ────────────────────────────────────────────────
export const SPRINT_STATUS = {
  PLANNING:  'planning',
  ACTIVE:    'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SPRINT_STATUS_LABELS = {
  [SPRINT_STATUS.PLANNING]:  'Planning',
  [SPRINT_STATUS.ACTIVE]:    'Active',
  [SPRINT_STATUS.COMPLETED]: 'Completed',
  [SPRINT_STATUS.CANCELLED]: 'Cancelled',
};

// ─── Project Status ───────────────────────────────────────────────
export const PROJECT_STATUS = {
  DRAFT:       'draft',
  ACTIVE:      'active',
  ON_HOLD:     'on_hold',
  COMPLETED:   'completed',
  ARCHIVED:    'archived',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.DRAFT]:     'Draft',
  [PROJECT_STATUS.ACTIVE]:    'Active',
  [PROJECT_STATUS.ON_HOLD]:   'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.ARCHIVED]:  'Archived',
};

// ─── Sidebar Config ───────────────────────────────────────────────
export const SIDEBAR_WIDTH          = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const HEADER_HEIGHT          = 64;

// ─── API Pagination ───────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
