// app/dashboard/page.tsx
'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRouter() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (!profile) return;

      switch (profile.role) {
        case 'ADMIN':
          router.replace('/dashboard/admin');
          break;
        case 'RECYCLER':
          router.replace('/dashboard/recycler');
          break;
        case 'COLLECTOR':
          router.replace('/dashboard/collector');
          break;
        default:
          router.replace('/dashboard/user');
      }
      setLoading(false);
    };

    determineDashboard();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return null;
}