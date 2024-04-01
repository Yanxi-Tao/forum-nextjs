'use server'

import { deleteCommentById } from '@/data/comment'

export const deleteComment = async (id: string) => {
  return await deleteCommentById(id)
}
