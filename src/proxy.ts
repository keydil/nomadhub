import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

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
};

export async function proxy(req: NextRequest) {
  // 1. Update and fetch Auth Session (Security First)
  const { supabaseResponse, user } = await updateSession(req);
  const url = req.nextUrl;

  // -- AUTH GUARD START --
  
  // If user tries to access dashboard but isn't logged in, direct them away securely.
  if (url.pathname.startsWith('/vendor') && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    // Preserve redirect parameter to let them come back optionally, but simpler for now:
    return NextResponse.redirect(redirectUrl);
  }
  
  // Prevent infinite looping if logged in users visit login page
  if (url.pathname === '/login' && user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/vendor';
    return NextResponse.redirect(redirectUrl);
  }
  
  // -- AUTH GUARD END --

  // 2. Get hostname logic for Tenants (Routing Second)
  const hostname = req.headers.get('host') || 'localhost:3000';

  let currentHost = hostname
    .replace('.nomadhub.app', '')
    .replace('.localhost:3000', '');
    
  if (currentHost.includes('.my.id')) {
    currentHost = currentHost.replace('.my.id', '');
  }

  const isMainDomain = [
    'nomadhub.app',
    'localhost:3000',
    'www.nomadhub.app',
    'www',
    'localhost'
  ].includes(currentHost) || currentHost.includes('.run.app');

  // EXCLUDE static framework paths explicitly if they leaked into here somehow.
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
    return supabaseResponse;
  }

  // If it's main domain, allow navigation naturally (along with auth updates).
  // Also ensure we do NOT rewrite dynamic paths inside main dashboards (like /vendor or /login)
  if (isMainDomain || url.pathname.startsWith('/vendor') || url.pathname.startsWith('/login')) {
    return supabaseResponse;
  }

  // 3. Rewrite to root dynamic route for CUSTOM TENANT domains.
  const tenantUrl = req.nextUrl.clone();
  tenantUrl.pathname = `/${currentHost}${url.pathname === '/' ? '' : url.pathname}`;
  
  // Combine rewrite behavior WITH refreshed Auth response headers.
  return NextResponse.rewrite(tenantUrl, {
    request: {
      headers: supabaseResponse.headers
    }
  });
}
