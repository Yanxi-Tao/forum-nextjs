import { db } from '@/db/client'

export const getAllComments = async (postId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        author: true,
        repliesTo: true,
        children: true,
        _count: { select: { children: true } },
      },
    })
    return comments
  } catch {
    return []
  }
}
