import { db } from '@/db/client'

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    })
    return verificationToken
  } catch {
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    return verificationToken
  } catch {
    return null
  }
}

export const deleteVerificationTokenById = async (id: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        id,
      },
    })
  } catch {
    return null
  }
}
