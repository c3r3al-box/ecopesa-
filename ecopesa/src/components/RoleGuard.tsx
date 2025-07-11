// components/RoleGuard.tsx
'use client';

import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { checkUserRole, ROLES } from '@/utils/roles';
import type { UserRole } from '@/utils/roles';
// Simple fallback loading spinner
const LoadingSpinner = () => <div>Loading...</div>;

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode; // Optional custom loading UI
}

export default function RoleGuard({
  children,
  requiredRole,
  fallback,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // Track current path for login redirect

  if (status === "loading") {
    return fallback ?? <LoadingSpinner />; // Better loading state
  }

  // Redirect unauthenticated users to login with return URL
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  // Check role permissions
  if (!checkUserRole(session.user, requiredRole)) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}