'use server'

import { db } from '@/db/client'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { currentUser } from '@/lib/auth'

export const emialVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)
  const user = await currentUser()

  if (!existingToken) {
    return { type: 'error', message: 'Invalid token' }
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date()

  if (hasExpired) {
    return { type: 'error', message: 'Token has expired' }
  }

  if (!user) {
    return { type: 'error', message: 'Unauthorized' }
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  })

  return { type: 'success', message: 'Email verified' }
}
