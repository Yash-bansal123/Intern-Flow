import { ROLES, ROLE_HIERARCHY } from './constants';

/**
 * Check if a user has one of the specified roles.
 * @param {object} user - user object with .role
 * @param  {...string} roles - allowed roles
 * @returns {boolean}
 */
export const hasRole = (user, ...roles) => {
  const role = user?.role || user?.role_name;
  if (!role) return false;
  return roles.includes(role);
};

/**
 * Check if user's role is at or above a required level in the hierarchy.
 * Hierarchy (highest → lowest): admin → faculty → mentor → team_lead → intern
 * @param {object} user
 * @param {string} requiredRole
 * @returns {boolean}
 */
export const hasMinRole = (user, requiredRole) => {
  const role = user?.role || user?.role_name;
  if (!role) return false;
  const userIndex    = ROLE_HIERARCHY.indexOf(role);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  if (userIndex === -1 || requiredIndex === -1) return false;
  return userIndex <= requiredIndex; // lower index = higher privilege
};

/**
 * Check if user is an admin.
 */
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);

/**
 * Check if user is faculty or above.
 */
export const isPlacementCoordinatorOrAbove = (user) => hasMinRole(user, ROLES.PLACEMENT_COORDINATOR);

/**
 * Check if user is a mentor or above.
 */
export const isMentorOrAbove = (user) => hasMinRole(user, ROLES.MENTOR);

/**
 * Check if user can edit a resource based on ownership or elevated role.
 * @param {object} user - current user
 * @param {object} resource - resource with .createdBy or .owner
 * @returns {boolean}
 */
export const canEdit = (user, resource) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isPlacementCoordinatorOrAbove(user)) return true;

  const ownerId = resource?.createdBy?._id || resource?.createdBy || resource?.owner?._id || resource?.owner;
  return user._id === ownerId;
};

/**
 * Check if user can delete a resource.
 * Only admins and faculty can delete any resource; owners can delete their own.
 */
export const canDelete = (user, resource) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (hasRole(user, ROLES.PLACEMENT_COORDINATOR)) return true;

  const ownerId = resource?.createdBy?._id || resource?.createdBy || resource?.owner?._id || resource?.owner;
  return user._id === ownerId;
};

/**
 * Check if user can manage other users (admin only).
 */
export const canManageUsers = (user) => isAdmin(user);

/**
 * Check if user can assign tasks (mentor or above).
 */
export const canAssignTasks = (user) => isMentorOrAbove(user);

/**
 * Check if user can create projects (mentor or above).
 */
export const canCreateProjects = (user) => isMentorOrAbove(user);

/**
 * Get the list of navigable sections for a given role.
 * @param {string} role
 * @returns {string[]}
 */
export const getAllowedSections = (role) => {
  const common = ['dashboard', 'projects', 'tasks', 'profile'];

  switch (role) {
    case ROLES.ADMIN:
      return [...common, 'sprints', 'kanban', 'internship', 'skills', 'placement', 'resume', 'analytics', 'admin'];
    case ROLES.PLACEMENT_COORDINATOR:
      return [...common, 'sprints', 'kanban', 'internship', 'skills', 'placement', 'analytics'];
    case ROLES.MENTOR:
      return [...common, 'sprints', 'kanban', 'internship', 'skills', 'analytics'];
    case ROLES.TEAM_LEAD:
      return [...common, 'sprints', 'kanban', 'skills'];
    case ROLES.STUDENT:
      return [...common, 'kanban', 'skills', 'resume', 'internship'];
    default:
      return common;
  }
};
