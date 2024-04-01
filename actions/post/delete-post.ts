'use server'
import { deletePostById } from '@/data/post'

export const deletePost = async (id: string) => {
  return await deletePostById(id)
}
