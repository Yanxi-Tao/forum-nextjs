'use server'

import { getAllComments } from '@/data/comment'
import { unstable_noStore } from 'next/cache'

export const fetchComments = async (postId: string) => {
  unstable_noStore()
  return await getAllComments(postId)
}
