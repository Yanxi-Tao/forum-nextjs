'use server'

import { getCommentsByParent, getCommentsByPost } from '@/data/comment'
import { unstable_cache } from 'next/cache'

export const fetchComments = unstable_cache(
  async (postId: string, take: number, offset: number) => {
    const comments = await getCommentsByPost(postId, take, offset)
    return { comments, offset: offset + comments.length }
  },
  ['comments'],
  {
    tags: ['comments'],
  }
)

export const fetchSubComments = unstable_cache(
  async (parentId: string, take: number, offset: number) => {
    const subComments = await getCommentsByParent(parentId, take, offset)
    return { subComments, offset: offset + subComments.length }
  },
  ['subComments'],
  {
    tags: ['subComments'],
  }
)
