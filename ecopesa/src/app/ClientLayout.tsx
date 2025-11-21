'use client';

import { Inter } from 'next/font/google';
import PWAInstaller from '@/components/PWAInstaller';
import { SessionContextProvider, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <SessionContextProvider supabaseClient={supabase}>
        <Header />
        <main className="flex-grow min-h-0 overflow-y-auto scrollbar-hide">
          {children}
        </main>
        <PWAInstaller />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#064e3b',
              borderRadius: '8px',
              padding: '12px',
            },
          }}
        />
      </SessionContextProvider>
    </div>
  );
}

function Header() {
  const user = useUser(); // comes from SessionContextProvider

  return (
    <header className="bg-emerald-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">EcoPesa</h1>
      <nav className="flex gap-4 text-sm">
       

        {/* Only visible if logged in */}
        {user && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
