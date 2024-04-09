'use server'

import { db } from '@/db/client'

export const deleteUser = async (id: string) => {
  // todo - does not deletion if user is a community owner
  // require community to be deleted first or transfer ownership
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
