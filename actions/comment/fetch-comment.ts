'use server'

import { getAllComments } from '@/data/comment'

export const fetchComments = async (postId: string) => {
  return await getAllComments(postId)
}
