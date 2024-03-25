import { db } from './client'

export type GetAnswersByQuestionSlugType = Awaited<
  ReturnType<typeof getAnswersByQuestionSlug>
>
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
    console.log(fistQuery)

    return fistQuery?.answers
  } catch {
    return null
  }
}
