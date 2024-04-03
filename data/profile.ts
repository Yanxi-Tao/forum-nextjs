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
              },
            },
            upVotes: true,
            downVotes: true,
            author: true,
            community: true,
            comments: {
              select: {
                _count: {
                  select: {
                    children: true,
                  },
                },
              },
            },
          },
        },
        upVotedPosts: {
          include: {
            _count: {
              select: {
                children: true,
              },
            },
            upVotes: true,
            downVotes: true,
            author: true,
            community: true,
            comments: {
              select: {
                _count: {
                  select: {
                    children: true,
                  },
                },
              },
            },
          },
        },
        upVotedComments: true,
        comments: true,
        subscribedCommunities: true,
        ownedCommunities: true,
      },
    })
    return profile
  } catch {
    return null
  }
}
