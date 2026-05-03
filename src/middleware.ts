import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'aalikouch_admin';
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Security Headers
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' https: http:; frame-ancestors 'none';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 2. Basic CSRF Protection for API routes
  if (request.method !== 'GET' && request.method !== 'HEAD' && pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: 'CSRF Protection: Invalid Origin' }, { status: 403 });
    }
  }

  // 3. Protect admin panel and admin API routes
  if (pathname.startsWith('/admin-aalikouch-panel') || pathname.startsWith('/api/admin')) {
    // Skip session API route to allow login
    if (pathname === '/api/admin/session') {
      return response;
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return response;
    }

    try {
      await jwtVerify(token, SECRET);
      return response;
    } catch (error) {
      console.error('JWT Verification failed:', error);
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const nextResponse = NextResponse.next();
      nextResponse.cookies.delete(COOKIE_NAME);
      return nextResponse;
    }
  }

  // 3. Optional Global Site Protection
  // If SITE_PROTECTED is true, redirect all traffic to admin panel to unlock
  if (process.env.SITE_PROTECTED === 'true' && pathname !== '/admin-aalikouch-panel' && !pathname.startsWith('/api/admin/session')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin-aalikouch-panel', request.url));
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL('/admin-aalikouch-panel', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin-aalikouch-panel/:path*',
    '/api/admin/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, but we explicitly included /api/admin above)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
