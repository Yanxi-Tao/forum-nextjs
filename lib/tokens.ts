import crypto from 'crypto'

import { db } from '@/db/client'

import { getVerificationTokenByEmail } from '@/db/verification-token'

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
