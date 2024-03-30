import { db } from '@/db/client'

export const getDefaultQuestionsOrArticles = async ({
  communityName,
  offset,
  take,
}: {
  communityName: string | undefined
  offset: number
  take: number
}) => {
  try {
    const posts = await db.post.findMany({
      where: {
        community: {
          name: communityName,
        },
      },
      take,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch {
    return []
  }
}

export const getSearchedQuestionsOrArticles = async ({
  search,
  communityName,
  offset,
  take,
}: {
  search: string
  communityName: string | undefined
  offset: number
  take: number
}) => {
  try {
    const posts = await db.post.findMany({
      where: {
        community: {
          name: communityName,
        },
        OR: [
          {
            title: {
              search,
              mode: 'insensitive',
            },
          },
          {
            content: {
              search,
              mode: 'insensitive',
            },
          },
        ],
      },
      take,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch {
    return []
  }
}
