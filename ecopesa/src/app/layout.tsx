import type { Metadata, Viewport } from 'next';
import ClientLayout from './ClientLayout';

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
