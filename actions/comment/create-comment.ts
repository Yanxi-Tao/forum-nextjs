'use server'

import { z } from 'zod'
import { CreateCommentSchema } from '@/schemas'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'

export const createComment = async (data: z.infer<typeof CreateCommentSchema>) => {
  const user = await currentUser()
  if (!user || !user.id) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = CreateCommentSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { content, postId, parentId, repliesToId } = validatedData.data

  try {
    await db.comment.create({
      data: {
        content,
        postId,
        parentId,
        authorId: user.id,
        repliesToId,
      },
    })
    return { type: 'success', message: 'Comment created' }
  } catch {
    return { type: 'error', message: 'Failed to create comment' }
  }
}
