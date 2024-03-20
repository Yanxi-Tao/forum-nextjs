import authConfig from '@/auth.config'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTES,
  AUTH_ROUTES,
  AUTH_API_ROUTE,
  DEFAULT_LOGIN_REDIRECT,
} from '@/routes'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(AUTH_API_ROUTE)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)

  // if the route is auth api route then allow access
  if (isApiAuthRoute) {
    return
  }

  // if the route is auth route and user is logged in then redirect to default login redirect
  // otherwise allow access
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  // if the route is not public and user is not logged in then redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl))
  }

  return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
