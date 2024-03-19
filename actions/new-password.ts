'use server'

import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { NewPasswordSchema } from '@/lib/validations'
import { z } from 'zod'

import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const newPassword = async (
  value: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: 'Token does not exist' }
  }

  const validatedFields = NewPasswordSchema.safeParse(value)
  if (!validatedFields.success) {
    return { error: 'Invalid password' }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: 'Token does not exist' }
  }

  const hasExpired = new Date() > new Date(existingToken.expiresAt)
  if (hasExpired) {
    return { error: 'Token has expired' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  })

  await db.passwordResetToken.delete({ where: { id: existingToken.id } })

  return { success: 'Password reset successfully!' }
}
