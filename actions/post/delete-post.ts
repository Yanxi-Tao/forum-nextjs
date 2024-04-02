'use server'
import { deletePostById } from '@/data/post'
import { PostType } from '@prisma/client'

export const deletePost = async (id: string, type: PostType) => {
  // todo - if allow delete of question since answers will be deleted as well
  return await deletePostById(id)
}
