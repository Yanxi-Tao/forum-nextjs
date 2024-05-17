'use server'

import { db } from '@/db/client'
import { revalidatePath } from 'next/cache'

export const deleteReport = async (id: string) => {
  try {
    await db.report.delete({
      where: {
        id,
      },
    })
    revalidatePath('/moderate')
    return true
  } catch (e) {
    return false
  }
}
