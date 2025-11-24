'use client';

import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import { usePathname } from 'next/navigation';

export default function Header() {
  const user = useUser();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Hide nav links on landing and auth pages
  const hideLinks =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/auth');

  return (
    <header className="bg-emerald-900 text-white p-4 flex justify-between items-center">
      {/* Logo always visible */}
      <Link href="/" className="text-xl font-bold">
        EcoPesa
      </Link>

      {/* Navigation links only when not hidden */}
      {!hideLinks && (
        <nav className="flex gap-4 text-sm">
          {!user ? (
            <>
              <Link href="/auth/login" className="hover:text-emerald-300">
                Login
              </Link>
              <Link href="/auth/signup" className="hover:text-emerald-300">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:text-emerald-300">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-emerald-300">
                Profile
              </Link>
              <Link href="/rewards" className="hover:text-emerald-300">
                Rewards
              </Link>
              <button
                onClick={handleSignOut}
                className="hover:text-red-300"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
