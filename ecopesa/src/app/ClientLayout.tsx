'use client';

import { Inter } from 'next/font/google';
import PWAInstaller from '@/components/PWAInstaller';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/header'; 

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} h-screen flex flex-col overflow-hidden`}>
      <SessionContextProvider supabaseClient={supabase}>
        {/* Header always visible */}
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
