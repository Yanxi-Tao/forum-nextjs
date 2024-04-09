'use server'

import { db } from '@/db/client'

export const deleteUser = async (id: string) => {
  try {
    await db.user.delete({
      where: {
        id,
      },
    })
    return true
  } catch {
    return false
  }
}
