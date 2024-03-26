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

export const getDefaultPosts = async (
  take: number,
  cursor: string | undefined
) => {
  try {
    const posts = await db.post.findMany({
      where: {
        NOT: { type: 'ANSWER' },
      },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        type: true,
        slug: true,
        community: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
            slug: true,
          },
        },
        preview: true,
        title: true,
        createdAt: true,
        votes: true,
        _count: {
          select: {
            answers: true,
            comments: true,
          },
        },
      },
    })
    return posts
  } catch {
    return null
  }
}

export const getPostsBySerch = async (
  search: string,
  take: number,
  cursor: string | undefined
) => {
  try {
    const posts = await db.post.findMany({
      where: {
        OR: [
          { title: { search: search.split(' ').join(' & ') } },
          { content: { search: search.split(' ').join(' & ') } },
        ],
        NOT: { type: 'ANSWER' },
      },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        type: true,
        slug: true,
        community: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
            slug: true,
          },
        },
        preview: true,
        title: true,
        createdAt: true,
        votes: true,
        _count: {
          select: {
            answers: true,
            comments: true,
          },
        },
      },
    })
    return posts
  } catch {
    return null
  }
}
