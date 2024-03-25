import { db } from './client'

export const getQuestionBySlug = async (slug: string) => {
  try {
    const question = await db.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        votes: true,
        author: true,
        community: true,
        createdAt: true,
        _count: {
          select: { answers: true },
        },
      },
    })

    return question
  } catch {
    return null
  }
}
