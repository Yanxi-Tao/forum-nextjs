import { db } from './client'

export type GetQuestionBySlugType = Awaited<
  ReturnType<typeof getQuestionBySlug>
>
export const getQuestionBySlug = async (slug: string) => {
  try {
    const question = await db.post.findUnique({
      where: {
        slug,
      },
      select: {
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
