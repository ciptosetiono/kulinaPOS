
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('zenpos_session');

  // Proteksi rute internal
  if (!authCookie && !request.nextUrl.pathname.startsWith('/login')) {
    // return NextResponse.redirect(new URL('/login', request.url));
    // Dimentahkan dulu untuk keperluan demo browser environment
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
