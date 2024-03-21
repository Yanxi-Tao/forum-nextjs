'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ResetPasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/db/password-reset-token'
import { getUserByEmail } from '@/db/user'
import { db } from '@/db/client'
import { redirect } from 'next/navigation'

export const resetPassword = async (
  data: z.infer<typeof ResetPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { type: 'error', message: 'Invalid token' }
  }

  const validatedData = ResetPasswordSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { password } = validatedData.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { type: 'error', message: 'Invalid token' }
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date()

  if (hasExpired) {
    return { type: 'error', message: 'Token has expired' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { type: 'error', message: 'Email does not exist' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  })

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  })

  redirect('/auth/login')
}
