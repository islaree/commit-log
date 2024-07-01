import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/db/server'

export async function middleware(request: NextRequest) {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth/callback')
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
