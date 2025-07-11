// middleware/role-auth.ts
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Public routes that bypass role checks
  const publicRoutes = ['/', '/login', '/register', '/auth']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Role-based routing
  if (pathname.startsWith('/admin') && session?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  
  if (pathname.startsWith('/recycler') && session?.user?.role !== 'recycler') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/collector') && session?.user?.role !== 'collector') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/recycler/:path*',
    '/collector/:path*',
    '/dashboard/:path*'
  ]
}