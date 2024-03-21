import crypto from 'crypto'
import { nanoid } from 'nanoid'

import { db } from '@/db/client'

import { getVerificationTokenByEmail } from '@/db/verification-token'
import { getPasswordResetTokenByEmail } from '@/db/password-reset-token'

export const generatePasswordResetToken = async (email: string) => {
  const token = nanoid()
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomInt(100_100, 1_100_100).toString()
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return verificationToken
}