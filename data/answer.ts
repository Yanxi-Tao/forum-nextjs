import { db } from '@/db/client'

export const getAnswersByQuestionSlug = async (
  slug: string,
  take: number,
  cursor: string | undefined
) => {
  try {
    const fistQuery = await db.post.findUnique({
      where: {
        slug,
      },
      select: {
        answers: {
          take,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          select: {
            id: true,
            author: true,
            content: true,
            votes: true,
            comments: true,
            createdAt: true,
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    return fistQuery?.answers
  } catch {
    return null
  }
}
