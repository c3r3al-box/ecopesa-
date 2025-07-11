// src/utils/roles.ts
export type UserRole = 'admin' | 'recycler' | 'collector' | 'user';
//
export const checkUserRole = (
  user: { role?: UserRole } | null | undefined, 
  requiredRole: UserRole
): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true; // Admins bypass all checks
  return user.role === requiredRole;
};

export const ROLES = {
  ADMIN: 'admin',
  RECYCLER: 'recycler',
  COLLECTOR: 'collector',
  USER: 'user',
} as const;