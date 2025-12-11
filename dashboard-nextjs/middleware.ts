import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Get subdomain from hostname
  // example.sellercentry.com -> example
  const parts = hostname.split('.')
  let subdomain = ''
  
  // Handle different environments
  if (hostname.includes('localhost')) {
    // Local development - no subdomain routing
    subdomain = 'example' // default for testing
  } else if (hostname.includes('vercel.app')) {
    // Vercel preview deployments
    // seller-centry-dashboard-git-main-majestiq.vercel.app
    subdomain = 'example' // default for preview
  } else if (parts.length >= 3) {
    // Production: example.sellercentry.com
    subdomain = parts[0]
    
    // Skip www subdomain
    if (subdomain === 'www') {
      // Redirect www to non-www or handle differently
      return NextResponse.next()
    }
  }
  
  // Store subdomain in header for use in the app
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-subdomain', subdomain)
  
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
