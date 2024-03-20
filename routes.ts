/**
 * This array contains all the routes that are public and can be accessed without authentication
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = ['/']

/**
 * This array contains all the routes that are private and can be accessed only with authentication
 * @type {string[]}
 */
export const PRIVATE_ROUTES: string[] = ['/dashboard']

/**
 * This array contains all the routes that are related to authentication
 * @type {string[]}
 */
export const AUTH_ROUTES: string[] = ['/auth/login', '/auth/register']

/**
 * This route stores the prefix to the API route for authentication
 * @type {string}
 */
export const AUTH_API_ROUTE: string = '/api/auth'

/**
 * Default redirect route after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/private'
