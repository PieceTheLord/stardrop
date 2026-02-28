// Location: /middleware.ts (Root directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseProxy } from './lib/Supabase/proxy';
import { createClient } from './utils/supabase/server';

export async function proxy(request: NextRequest) {



  // 1. Handle Preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://stardrop-landing.vercel.app',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 2. Handle actual requests
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', 'https://stardrop-landing.vercel.app');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return await supabaseProxy(request);

}

// 3. Only apply to API routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",]
};
