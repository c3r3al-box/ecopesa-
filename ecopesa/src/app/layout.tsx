import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import PWAInstaller from '@/components/PWAInstaller'
import SignupPage from '@/app/Register/[role]/page'
import LoginPage from '@/app/login/page'
const inter = Inter({ subsets: ['latin'] })

// ✅ Metadata export (no themeColor here)
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
}

// ✅ Viewport export with themeColor
export const viewport: Viewport = {
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
        
         
          </div>
        <PWAInstaller />
      </body>
    </html>
  )
}
