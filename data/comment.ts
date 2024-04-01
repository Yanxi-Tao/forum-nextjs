import { db } from '@/db/client'

export const getAllComments = async (postId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        author: true,
        repliesTo: true,
        children: {
          include: {
            author: true,
            repliesTo: true,
          },
        },
        _count: { select: { children: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return comments
  } catch {
    return []
  }
}
