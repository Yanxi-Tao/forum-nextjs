'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationTokenEmail } from '@/lib/mail'
import { RegisterSchema } from '@/schemas'
import { createUser, getUserByEmail } from '@/db/user'
import {
  deleteVerificationTokenById,
  getVerificationTokenByEmail,
} from '@/db/verification-token'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'

export const register = async (
  data: z.infer<typeof RegisterSchema>,
  submitType: 'register' | 'token'
) => {
  const validatedData = RegisterSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { name, email, password, token } = validatedData.data

  // Check if email already exists
  const isUserExist = await getUserByEmail(email)
  if (isUserExist) {
    return { type: 'error', message: 'Email already exists' }
  }

  // Send verification token email if sumbitType is token
  const isUserVerified = await getVerificationTokenByEmail(email)
  if (submitType === 'token') {
    const verificationToken = await generateVerificationToken(email)
    sendVerificationTokenEmail(verificationToken.email, verificationToken.token)
    return { type: 'success', message: 'Verification code sent' }
  }

  // Check if token is valid or expired
  if (!isUserVerified) {
    return { type: 'error', message: 'Please verify your email' }
  }

  const hasExpired = new Date() > new Date(isUserVerified.expiresAt)
  if (isUserVerified.token !== token || hasExpired) {
    return { type: 'error', message: 'Invalid token' }
  }

  // Delete token when verification is successful
  await deleteVerificationTokenById(isUserVerified.id)

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  createUser(name, email, hashedPassword, new Date())

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { type: 'error', message: 'Invalid credentials' }
        case 'AuthorizedCallbackError':
          return { type: 'error', message: 'Authorization failed' }
        default:
          return { type: 'error', message: 'An error occurred' }
      }
    }

    throw error
  }
}
