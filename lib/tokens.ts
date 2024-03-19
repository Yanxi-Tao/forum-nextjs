import crypto from 'crypto'
import { nanoid } from 'nanoid'

import { db } from '@/lib/db'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_100, 1_000_100).toString()
  // in prod change expiresAt to 15 minutes
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hour from now

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = nanoid()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hour from now

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
  const token = nanoid()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hour from now

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
