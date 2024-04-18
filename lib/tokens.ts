import crypto from 'crypto'
import { nanoid } from 'nanoid'

import { db } from '@/db/client'

import {
  deleteVerificationTokenById,
  getVerificationTokenByEmail,
} from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import {
  deleteVerificationCodeById,
  getVerificationCodeByEmail,
} from '@/data/verification-code'

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

  try {
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    })

    return passwordResetToken
  } catch {
    return null
  }
}

export const generateVerificationToken = async (email: string) => {
  const token = nanoid()
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await deleteVerificationTokenById(existingToken.id)
  }

  try {
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    })

    return verificationToken
  } catch {
    return null
  }
}

export const generateVerificationCode = async (email: string) => {
  const code = crypto.randomInt(100_100, 1_100_100).toString() // 6 digits
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour

  const existingCode = await getVerificationCodeByEmail(email)

  if (existingCode) {
    await deleteVerificationCodeById(existingCode.id)
  }

  try {
    const verificationCode = await db.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    })

    return verificationCode
  } catch {
    return null
  }
}
