import { db } from '@/db/client'

export const getDefaultCommunities = async ({
  offset,
  take,
}: {
  offset: number
  take: number
}) => {
  try {
    const communities = await db.community.findMany({
      where: {
        isPublic: true,
      },
      take,
      skip: offset,
    })
    return communities
  } catch {
    return []
  }
}

export const getSearchedCommunities = async ({
  search,
  offset,
  take,
}: {
  search: string
  offset: number
  take: number
}) => {
  try {
    const communities = await db.community.findMany({
      where: {
        OR: [
          {
            name: {
              search: search.split(' ').join(' | '),
              mode: 'insensitive',
            },
          },
          {
            description: {
              search: search.split(' ').join(' | '),
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        isPublic: true,
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'description'],
          search: search.split(' ').join(' | '),
          sort: 'desc',
        },
      },
      take,
      skip: offset,
    })

    return communities
  } catch {
    return []
  }
}

export const getCommunityBySlug = async (slug: string) => {
  try {
    const community = await db.community.findUnique({
      where: {
        slug,
      },
    })
    return community
  } catch {
    return null
  }
}

export const getCommunitiesByUser = async (userId: string) => {
  try {
    const communities = await db.community.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
          {
            owner: {
              id: userId,
            },
          },
        ],
      },
    })
    return communities
  } catch {
    return []
  }
}

export const getCommunityById = async (id: string) => {
  try {
    const community = await db.community.findUnique({
      where: {
        id,
      },
    })
    return community
  } catch {
    return null
  }
}
