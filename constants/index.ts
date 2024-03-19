/**
 * An array of public routes
 * Accessible without authentication
 * @type {string[]}
 */
export const publicRoutes = ['/', '/protected']

/**
 * An array of routes used for authentication
 * These routes will redirect users to ?
 * @type {string[]}
 */
export const authRoutes = ['/login', '/register']

/**
 * The prefix for the API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The default login redirect
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/'
