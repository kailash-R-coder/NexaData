import { authConfig } from "@/lib/auth"
import { NextResponse } from "next/server"

export default authConfig((req) => {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth/register',
  ]

  // API routes
  const apiRoutes = ['/api/']

  // Check if the current path is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow API routes to handle their own authentication
  if (pathname.startsWith(apiRoutes[0])) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!req.auth) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}