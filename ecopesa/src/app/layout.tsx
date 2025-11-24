import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import 'leaflet/dist/leaflet.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'EcoPesa',
    template: '%s | EcoPesa',
  },
  description: 'Turn your waste into EcoPesa points and redeem exciting rewards',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-screen">
      <body className={`${inter.className} min-h-screen overflow-y-auto bg-gradient-to-br from-emerald-50 to-green-50 text-gray-800 antialiased`}>
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-emerald-100 opacity-20 blur-xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-green-100 opacity-20 blur-xl"></div>
        </div>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

 