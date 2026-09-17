import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware for public pages that don't need auth check
  const publicPaths = ['/', '/about-tarot', '/services', '/partners', '/blog', '/contact']
  const isPublic = publicPaths.some((p) =>
    request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + '/')
  )

  // Public pages: skip session refresh entirely for speed
  if (isPublic && !request.nextUrl.pathname.startsWith('/partners/') ) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
