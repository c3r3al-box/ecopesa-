'use client';
import { useUser } from '@supabase/auth-helpers-react';

export default function CollectorDashboard() {
  const user = useUser();
  if (!user) return <p>Loading user…</p>;

  return <div>Hello, {user.email}</div>;
}
