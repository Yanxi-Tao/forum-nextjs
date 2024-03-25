import { db } from './client'

export const getAnswersByQuestionSlug = async (slug: string, take: number) => {
  try {
    const fistQuery = await db.post.findUnique({
      where: {
        slug,
      },
      select: {
        answers: {
          take,
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
            votes: 'asc',
          },
        },
      },
    })
    return fistQuery?.answers
  } catch {
    return null
  }
}
