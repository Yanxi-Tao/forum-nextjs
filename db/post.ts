import { db } from './client'

export const getPostsWithPagination = async (cursor: string, take: number) => {
  try {
    const posts = await db.post.findMany({
      take,
      cursor: {
        id: cursor,
      },
      include: {
        author: true,
        community: true,
        _count: {
          select: { comments: true },
        },
      },
    })
    return posts
  } catch {
    return null
  }
}

export const getQuestionBySlug = async (slug: string) => {
  try {
    const question = await db.post.findUnique({
      where: {
        slug,
      },
      include: {
        community: true,
        author: true,
        answers: true,
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

export const getArticleBySlug = async (slug: string) => {
  try {
    const article = await db.post.findUnique({
      where: {
        slug,
      },
      include: {
        community: true,
        author: true,
        comments: true,
        _count: {
          select: { comments: true },
        },
      },
    })
    return article
  } catch {
    return null
  }
}
