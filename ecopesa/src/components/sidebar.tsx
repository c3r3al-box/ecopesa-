// components/sidebar.tsx
'use client';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const supabase = createClient();
  const pathname = usePathname();
  const [role, setRole] = useState<string>('USER');

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();
      
      if (profile?.role) setRole(profile.role);
    };

    fetchRole();
  }, []);

  const commonLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/settings', label: 'Settings' }
  ];

  const roleSpecificLinks = {
    ADMIN: [
      { href: '/dashboard/admin/users', label: 'User Management' },
      { href: '/dashboard/admin/reports', label: 'Reports' }
    ],
    RECYCLER: [
      { href: '/dashboard/recycler/materials', label: 'Materials' },
      { href: '/dashboard/recycler/stats', label: 'Statistics' }
    ],
    COLLECTOR: [
      { href: '/dashboard/collector/schedule', label: 'Schedule' },
      { href: '/dashboard/collector/routes', label: 'Routes' }
    ],
    USER: [
      { href: '/dashboard/user/rewards', label: 'My Rewards' },
      { href: '/dashboard/user/history', label: 'History' }
    ]
  };

  return (
    <div className="w-64 bg-gray-100 p-4 h-screen overflow-hidden">
      <nav className="space-y-2">
        {[...commonLinks, ...(roleSpecificLinks[role as keyof typeof roleSpecificLinks] || [])].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded ${pathname === link.href ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}