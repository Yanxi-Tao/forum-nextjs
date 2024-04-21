import { db } from '@/db/client'
import { DELETED_CONTENT } from '@/lib/constants'

export const getAllComments = async (postId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        upVotes: true,
        author: true,
        repliesTo: true,
        children: {
          include: {
            upVotes: true,
            author: true,
            repliesTo: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { children: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    return comments
  } catch {
    return []
  }
}

export const deleteCommentById = async (id: string) => {
  try {
    await db.comment.update({
      where: { id },
      data: {
        content: DELETED_CONTENT,
      },
    })
    return true
  } catch {
    return false
  }
}
