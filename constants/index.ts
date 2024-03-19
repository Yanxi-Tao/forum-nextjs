/**
 * An array of public routes
 * Accessible without authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', '/auth/new-verification']

/**
 * An array of routes used for authentication
 * These routes will redirect users to ?
 * @type {string[]}
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
]

/**
 * The prefix for the API authentication routes
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * The default login redirect
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/protected'
