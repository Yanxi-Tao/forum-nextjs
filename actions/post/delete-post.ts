'use server'
import { deletePostById, deletePostByIdAdmin } from '@/data/post'
import { currentUser } from '@/lib/auth'
import { PostType, UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const deletePost = async (id: string, type: PostType) => {
  // todo - if allow delete of question since answers will be deleted as well
  const user = await currentUser()
  if (!user) {
    return false
  }
  if (user.role === UserRole.ADMIN) {
    await deletePostByIdAdmin(id)
    revalidatePath('/moderate')
    return true
  }
  return await deletePostById(id, type)
}
