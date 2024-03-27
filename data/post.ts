import { db } from '@/db/client'

export const getPostsBySearchParams = async (
  search: string,
  cursor: string | undefined,
  take: number
) => {
  try {
    const posts = await db.post.findMany({
      where: {
        AND: [
          {
            title: {
              search: search.split(' ').join(' & '),
              mode: 'insensitive',
            },
          },
          {
            content: {
              search: search.split(' ').join(' & '),
              mode: 'insensitive',
            },
          },
          {
            type: {
              in: ['QUESTION', 'ARTICLE'],
            },
          },
        ],
      },
      cursor: cursor ? { id: cursor } : undefined,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        preview: true,
        votes: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            slug: true,
            name: true,
          },
        },
        community: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            answers: true,
          },
        },
      },
    })
    return posts
  } catch {
    return []
  }
}

export const getDefaultPosts = async (
  cursor: string | undefined,
  take: number
) => {
  try {
    const posts = await db.post.findMany({
      where: {
        type: {
          in: ['QUESTION', 'ARTICLE'],
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        preview: true,
        votes: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            slug: true,
            name: true,
          },
        },
        community: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            answers: true,
          },
        },
      },
    })
    return posts
  } catch {
    return []
  }
}
