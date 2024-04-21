import { db } from '@/db/client'

export const getUserProfileBySlug = async (slug: string) => {
  try {
    const profile = await db.user.findUnique({
      where: {
        slug,
      },
      include: {
        posts: {
          include: {
            _count: {
              select: {
                children: true,
                comments: true,
              },
            },
            bookmarks: true,
            upVotes: true,
            downVotes: true,
            author: true,
            community: true,
          },
        },
        upVotedPosts: {
          include: {
            _count: {
              select: {
                children: true,
                comments: true,
              },
            },
            bookmarks: true,
            upVotes: true,
            downVotes: true,
            author: true,
            community: true,
          },
        },
        bookmarkedPosts: {
          include: {
            _count: {
              select: {
                children: true,
                comments: true,
              },
            },
            bookmarks: true,
            upVotes: true,
            downVotes: true,
            author: true,
            community: true,
          },
        },
        upVotedComments: true,
        comments: true,
        subscribedCommunities: true,
        ownedCommunities: true,
        profile: true,
      },
    })
    return profile
  } catch {
    return null
  }
}

export const getEditUserProfileById = async (id: string) => {
  try {
    const profile = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        profile: true,
      },
    })
    return profile
  } catch {
    return null
  }
}
