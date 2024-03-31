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
        type: {
          in: ['question', 'article'],
        },
      },
      take,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
        author: true,
        community: true,
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
        type: {
          in: ['question', 'article'],
        },
        OR: [
          {
            title: {
              search: search.split(' ').join(' | '),
              mode: 'insensitive',
            },
          },
          {
            content: {
              search: search.split(' ').join(' | '),
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
      },
      take,
      skip: offset,
      orderBy: {
        _relevance: {
          fields: ['title', 'content'],
          search: search.split(' ').join(' | '),
          sort: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
        author: true,
        community: true,
      },
    })
    return posts
  } catch {
    return []
  }
}

export const getPostById = async (id: string) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
        author: true,
        community: true,
      },
    })
    return post
  } catch {
    return null
  }
}

export const getAnsewrs = async ({
  parentId,
  offset,
  take,
}: {
  parentId: string
  offset: number
  take: number
}) => {
  try {
    const answers = await db.post.findMany({
      where: {
        parentId,
        type: 'answer',
      },
      take,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        community: true,
        author: true,
        _count: {
          select: {
            children: true,
          },
        },
      },
    })
    return answers
  } catch {
    return []
  }
}
