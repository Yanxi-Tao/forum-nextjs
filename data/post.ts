import { db } from '@/db/client'

export const getPostsBySearchParams = async (
  search: string,
  communityName: string | undefined,
  cursor: string | undefined,
  take: number
) => {
  try {
    const posts = await db.post.findMany({
      where: {
        OR: [
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
        ],
        type: {
          in: ['QUESTION', 'ARTICLE'],
        },
        community: {
          name: communityName,
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
        slug: true,
        type: true,
        content: true,
        preview: true,
        votes: true,
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
        slug: true,
        type: true,
        content: true,
        preview: true,
        votes: true,
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
