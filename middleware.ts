import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookies or Authorization header
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const response = NextResponse.next();

    // Optionally add user info to request headers
    response.headers.set('x-user-id', (decoded as any).userId);
    response.headers.set('x-user-email', (decoded as any).email);

    return response;
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Optionally, configure which paths should run this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     * - register page
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};
