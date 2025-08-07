'use client';

import { Inter } from 'next/font/google';
import PWAInstaller from '@/components/PWAInstaller';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className={`${inter.className} antialiased`}>
      <SessionContextProvider supabaseClient={supabase}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-emerald-600 text-white p-4">
            <h1 className="text-xl font-bold">EcoPesa</h1>
          </header>
          <main className="flex-grow">{children}</main>
        </div>
        <PWAInstaller />
      </SessionContextProvider>
    </body>
  );
}
