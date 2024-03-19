'use server'

import { signIn } from '@/auth'
import bcrypt from 'bcryptjs'

import { z } from 'zod'
import { LoginSchema } from '@/lib/validations'
import { getUserByEmail } from '@/data/user'
import { DEFAULT_LOGIN_REDIRECT } from '@/constants'
import { AuthError } from 'next-auth'
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens'
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value)
  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password, code } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist' }
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password)

  if (!passwordMatch) {
    return { error: 'Invalid password' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )
    return { success: 'Confirmation email sent!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: 'Token does not exist' }
      }

      if (twoFactorToken.token !== code) {
        return { error: 'Invalid Code' }
      }

      const hasExpired = new Date() > new Date(twoFactorToken.expiresAt)

      if (hasExpired) {
        return { error: 'Code has expired' }
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
      return { twoFactor: true }
    }
  }

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
          return { error: 'Invalid credentials' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error
  }
}
