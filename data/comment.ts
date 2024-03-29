import { db } from '@/db/client'

export const getCommentsByPost = async (
  postId: string,
  take: number,
  offset: number
) => {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      take,
      skip: offset,
      select: {
        id: true,
        authorId: true,
        author: {
          select: {
            name: true,
            image: true,
            slug: true,
          },
        },
        likes: true,
        content: true,
        createdAt: true,
        children: {
          select: {
            content: true,
            likes: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true,
                slug: true,
              },
            },
            replyTo: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    })
    return comments
  } catch {
    return []
  }
}

export const getCommentsByParent = async (
  parentId: string,
  take: number,
  offset: number
) => {
  try {
    const subComments = await db.comment.findMany({
      where: {
        parentId,
      },
      take,
      skip: offset,
      select: {
        content: true,
        likes: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true,
            slug: true,
          },
        },
        replyTo: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })
    return subComments
  } catch {
    return []
  }
}
