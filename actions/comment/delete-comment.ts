'use server'

import { deleteCommentByIdAdmin, deleteCommentById } from '@/data/comment'
import { currentUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const deleteComment = async (id: string) => {
  const user = await currentUser()
  if (!user) {
    return false
  }
  if (user.role === UserRole.ADMIN) {
    await deleteCommentByIdAdmin(id)
    revalidatePath('/moderate')
    return true
  }
  return await deleteCommentById(id)
}
