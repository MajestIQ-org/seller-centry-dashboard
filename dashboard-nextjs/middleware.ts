import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const parts = hostname.split('.')
  let subdomain = ''
  
  // Handle different environments
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Local development - check for subdomain in localhost format
    // example.localhost:3000 or use default
    if (parts.length >= 2 && parts[0] !== 'localhost') {
      subdomain = parts[0]
    } else {
      subdomain = 'example' // default for testing
    }
  } else if (hostname.includes('vercel.app')) {
    // Vercel preview deployments - extract from URL or use default
    subdomain = 'example'
  } else if (parts.length >= 3) {
    // Production: example.sellercentry.com
    subdomain = parts[0]
    
    // Handle root domain or www
    if (subdomain === 'www' || parts.length === 2) {
      subdomain = '' // No subdomain for root domain
    }
  }
  
  // Store subdomain in header for use in the app
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-subdomain', subdomain || 'example')
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
