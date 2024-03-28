import { db } from '@/db/client'

export const getPostsBySearchParams = async (
  search: string,
  communityName: string | undefined,
  offset: number,
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
      skip: offset,
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

export const getDefaultPosts = async (offset: number, take: number) => {
  try {
    const posts = await db.post.findMany({
      where: {
        type: {
          in: ['QUESTION', 'ARTICLE'],
        },
      },
      skip: offset,
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
