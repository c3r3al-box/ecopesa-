'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Navbar = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Centers', href: '/CollectionCenters' },
    { name: 'Rewards', href: '/Rewards' },
    { name: 'History', href: '/History' },
    { name: 'Profile', href: '/Profile' },
  ]

  const isLinkActive = (href: string) => {
    return href === '/' ? pathname === href : pathname.startsWith(href)
  }

  return (
    <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
            <RecycleIcon className="h-7 w-7 text-white" />
            <span>EcoPesa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isLinkActive(link.href)
                    ? 'bg-emerald-800 text-[#d1fff3]'
                    : 'text-white hover:bg-emerald-700 hover:text-[#a0f3d4]'
                }`}
              >
                {link.name}
                {isLinkActive(link.href) && (
                  <span className="absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#79f4dc] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md bg-emerald-700 hover:bg-emerald-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-emerald-500 rounded-md mb-4 p-4 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isLinkActive(link.href)
                    ? 'bg-emerald-700 text-[#dcffe6]'
                    : 'text-white hover:bg-emerald-700 hover:text-[#a0f3d4]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

// Icon components
const RecycleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default Navbar
