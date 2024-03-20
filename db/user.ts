import { db } from '@/db/client'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch {
    return null
  }
}

export const getUserByID = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    })
    return user
  } catch {
    return null
  }
}

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    })
    return user
  } catch {
    return null
  }
}
