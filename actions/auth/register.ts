'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { generateVerificationCode } from '@/lib/tokens'
import { sendVerificationCodeEmail } from '@/lib/mail'
import { RegisterSchema } from '@/schemas'
import { createUser, getUserByEmail, getUserBySlug } from '@/data/user'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { deleteVerificationCodeById, getVerificationCodeByEmail } from '@/data/verification-code'
import { slugify } from '@/lib/slug'

export const register = async (data: z.infer<typeof RegisterSchema>, submitType: 'register' | 'token') => {
  const validatedData = RegisterSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { name, email, password, code } = validatedData.data

  // Check if email already exists
  const isUserExist = await getUserByEmail(email)
  if (isUserExist) {
    return { type: 'error', message: 'Email already exists' }
  }

  // Send verification token email if sumbitType is token
  const isUserVerified = await getVerificationCodeByEmail(email)
  if (submitType === 'token') {
    let verificationCode = await generateVerificationCode(email)

    while (verificationCode.code.length !== 6) {
      verificationCode = await generateVerificationCode(email)
    }

    await sendVerificationCodeEmail(verificationCode.email, verificationCode.code)
    return { type: 'success', message: 'Verification code sent' }
  }

  // Check if token is valid or expired
  if (!isUserVerified) {
    return { type: 'error', message: 'Please verify your email' }
  }

  const hasExpired = new Date() > new Date(isUserVerified.expiresAt)
  if (isUserVerified.code !== code || hasExpired) {
    return { type: 'error', message: 'Invalid token' }
  }

  // Delete token when verification is successful
  await deleteVerificationCodeById(isUserVerified.id)

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // slugify name
  let slug = slugify(name)
  while (await getUserBySlug(slug)) {
    slug = slugify(name)
  }

  // Create user
  createUser(name, email, hashedPassword, new Date(), slug)

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
        default:
          return { type: 'error', message: 'An error occurred' }
      }
    }

    throw error
  }
}
