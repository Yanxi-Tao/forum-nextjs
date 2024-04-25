import { auth } from '@/auth'

// export const runtime = 'experimental-edge'

import {
  PUBLIC_ROUTES,
  PRIVATE_ROUTES,
  AUTH_ROUTES,
  AUTH_API_ROUTE,
  DEFAULT_LOGIN_REDIRECT,
  UPLOADTHING_API_ROUTE,
} from '@/routes'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(AUTH_API_ROUTE)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)
  const isApiUploadthingRoute = nextUrl.pathname.startsWith(
    UPLOADTHING_API_ROUTE
  )

  // if the route is auth api route then allow access
  if (isApiAuthRoute || isApiUploadthingRoute) {
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
    let callBackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callBackUrl += nextUrl.search
    }
    const encodedCallBackUrl = encodeURIComponent(callBackUrl)
    return Response.redirect(
      new URL(`/auth/login?callBackUrl=${encodedCallBackUrl}`, nextUrl)
    )
  }

  return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
