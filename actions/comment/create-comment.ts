'use server'

import { CreateCommentSchema } from '@/schemas'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { CreateCommentSchemaTypes } from '@/lib/types'
import { getCommentById } from '@/data/comment'

export const createComment = async (data: CreateCommentSchemaTypes) => {
  const user = await currentUser()
  if (!user || !user.id) {
    return null
  }

  const validatedData = CreateCommentSchema.safeParse(data)
  if (!validatedData.success) {
    return null
  }

  const { content, postId, parentId, repliesToUserId, repliesToCommentId } =
    validatedData.data

  try {
    const comment = await db.comment.create({
      data: {
        content,
        postId,
        parentId,
        authorId: user.id,
        repliesToId: repliesToUserId,
      },
    })
    const newComment = await getCommentById(comment.id)
    if (!newComment) return null
    return { newComment, replyId: repliesToCommentId ?? '' }
  } catch {
    return null
  }
}
