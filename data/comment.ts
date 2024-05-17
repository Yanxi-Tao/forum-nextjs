import { db } from '@/db/client'
import { DELETED_CONTENT } from '@/lib/constants'

export const getAllComments = async (postId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { postId, parentId: null },
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
      },
      orderBy: {
        upVotes: {
          _count: 'desc',
        },
      },
    })
    return comments
  } catch {
    return []
  }
}

export const getCommentById = async (id: string) => {
  try {
    const comment = await db.comment.findUnique({
      where: { id },
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
      },
    })
    return comment
  } catch {
    return null
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

export const deleteCommentByIdAdmin = async (id: string) => {
  try {
    await db.comment.delete({
      where: { id },
    })
    return true
  } catch (e) {
    return false
  }
}
