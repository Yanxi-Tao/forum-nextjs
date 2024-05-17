'use server'

import { db } from '@/db/client'
import { revalidatePath } from 'next/cache'

export const deleteCommunity = async (id: string) => {
  try {
    await db.community.delete({
      where: {
        id,
      },
    })
    console.log('Deleted community')

    revalidatePath('/moderate')
    return true
  } catch (e) {
    return false
  }
}
