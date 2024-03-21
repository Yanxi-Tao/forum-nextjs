import { db } from './client'

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
