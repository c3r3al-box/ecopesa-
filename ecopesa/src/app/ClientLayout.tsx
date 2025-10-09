'use client';

import { Inter } from 'next/font/google';
import PWAInstaller from '@/components/PWAInstaller';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} antialiased`}>
      <SessionContextProvider supabaseClient={supabase}>
        <div className="h-screen flex flex-col overflow-hidden">
          <header className="bg-emerald-900 text-white p-4">
            <h1 className="text-xl font-bold">EcoPesa</h1>
          </header>
          
          <main className="flex-grow overflow-y-scroll scrollbar-hide">{children}</main>
        </div>
        <PWAInstaller />
      </SessionContextProvider>
    </div>
  );
}