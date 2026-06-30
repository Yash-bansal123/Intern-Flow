import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { hasRole, hasMinRole, canEdit, canDelete, isAdmin, getAllowedSections } from '../utils/permissions';

/**
 * usePermission – provides permission-checking functions
 * scoped to the current authenticated user.
 */
const usePermission = () => {
  const user = useSelector(selectCurrentUser);

  return useMemo(
    () => ({
      /** Check if the user has one of the provided roles. */
      hasRole: (...roles) => hasRole(user, ...roles),

      /** Check if the user's role is at or above the required level. */
      hasMinRole: (requiredRole) => hasMinRole(user, requiredRole),

      /** Check if the user can edit a given resource. */
      canEdit: (resource) => canEdit(user, resource),

      /** Check if the user can delete a given resource. */
      canDelete: (resource) => canDelete(user, resource),

      /** Shortcut: is current user an admin? */
      isAdmin: isAdmin(user),

      /** Get navigable sections for the user's role. */
      allowedSections: getAllowedSections(user?.role || user?.role_name),

      /** Check if the user can access a specific section. */
      canAccess: (section) => getAllowedSections(user?.role || user?.role_name).includes(section),
    }),
    [user],
  );
};

export default usePermission;
