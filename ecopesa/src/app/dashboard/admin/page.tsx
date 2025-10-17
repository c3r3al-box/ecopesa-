'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function AdminDashboard() {
  const user = useUser();
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.role) setRole(data.role);
    };

    fetchRole();
  }, [user]);

  //if (role !== 'admin') {
    //return (
      //<div className="p-6 text-center text-gray-600">
       // <h2 className="text-xl font-bold text-emerald-800 mb-2">Access Denied</h2>
        //<p>You must be an admin to view this dashboard.</p>
      //</div>
    //);
  //}

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">EcoPesa Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard title="Manage Jobs" href="/admin/jobs" description="Assign collectors and track job status" />
        <AdminCard title="Manage Centres" href="/admin/centres" description="Edit capacity, load, and location" />
        <AdminCard title="Assign Recyclers" href="/admin/recyclers" description="Link users to centres and generate PINs" />
        <AdminCard title="Assign Collectors" href="/admin/assign-collectors" description="Assign users to pickup jobs" />
        <AdminCard title="Audit Logs" href="/admin/logs" description="Review recycling submissions and verifications" />
        <AdminCard title="Manage Rewards" href="/admin/rewards" description="Create rewards and approve claims" />
        <AdminCard title="User Roles" href="/admin/users" description="Assign roles and manage accounts" />
        <AdminCard title="Analytics" href="/admin/analytics" description="View impact metrics and export data" />
      </div>
    </div>
  );
}

function AdminCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block">
      <h3 className="text-lg font-bold text-emerald-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
