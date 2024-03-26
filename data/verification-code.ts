import { db } from '@/db/client'

export const getVerificationCodeByEmail = async (email: string) => {
  try {
    const verificationCode = await db.verificationCode.findFirst({
      where: {
        email,
      },
    })
    return verificationCode
  } catch {
    return null
  }
}

export const deleteVerificationCodeById = async (id: string) => {
  try {
    await db.verificationCode.delete({
      where: {
        id,
      },
    })
  } catch {
    return null
  }
}
