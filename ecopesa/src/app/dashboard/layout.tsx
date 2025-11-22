'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/auth');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Scoped header for dashboard routes */}
      <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-emerald-700">EcoPesa Dashboard</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
        </nav>
      </header>

      <main className="flex-grow min-h-0 overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );
}
