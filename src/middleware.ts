import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('>>> [Middleware] Request intercepted:', req.method, req.nextUrl.pathname); // Log 1: Middleware Start

  // Detailliertes Logging der Request-Header
  console.log('>>> [Middleware] Request Headers:');
  req.headers.forEach((value, key) => {
    console.log(`>>> [Middleware]   ${key}: ${value}`);
  });
  console.log('>>> [Middleware] Cookie Header:', req.headers.get('cookie')); // Spezifisches Logging des Cookie-Headers


  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  console.log('>>> [Middleware] Calling supabase.auth.getUser()...'); // Log 2: Before getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log('>>> [Middleware] supabase.auth.getUser() response. User:', user ? user.id : null); // Log 3: After getUser, log user ID or null

  // Überprüfen, ob die URL Supabase Auth Tokens enthält (z.B. von einem Passwort-Reset-Link)
  const hasAuthParams = req.nextUrl.searchParams.has('access_token') || req.nextUrl.searchParams.has('refresh_token');
  console.log('>>> [Middleware] hasAuthParams:', hasAuthParams); // Log 4: hasAuthParams status


  // Wenn kein Benutzer angemeldet ist UND die URL keine Auth-Parameter enthält UND die Route mit /admin beginnt,
  // leite zur Login-Seite um.
  if (!user && !hasAuthParams && req.nextUrl.pathname.startsWith('/admin')) {
    console.log('>>> [Middleware] No user and accessing admin route, redirecting to /login'); // Log 5: Redirect to login
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    // Optional: Füge eine Meldung hinzu, warum umgeleitet wurde
    // redirectUrl.searchParams.set('message', 'Bitte melden Sie sich an, um auf den Admin-Bereich zuzugriffen.');
    return NextResponse.redirect(redirectUrl);
  }

  // Wenn der Benutzer angemeldet ist und versucht, auf die Login-Seite zuzugreifen,
  // leite zum Admin-Dashboard um.
  if (user && req.nextUrl.pathname === '/login') {
     console.log('>>> [Middleware] User logged in and accessing /login, redirecting to /admin/dashboard'); // Log 6: Redirect to dashboard
     const redirectUrl = req.nextUrl.clone();
     redirectUrl.pathname = '/admin/dashboard';
     return NextResponse.redirect(redirectUrl);
  }

  console.log('>>> [Middleware] Passing request through.'); // Log 7: Pass through
  return res;
}

export const config = {
  // Wende die Middleware auf alle Routen an, um sowohl Admin-Schutz als auch Login-Weiterleitung zu handhaben
  matcher: ['/admin/:path*', '/login'],
};
