import { db } from './db'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { nanoid } from 'nanoid'

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
