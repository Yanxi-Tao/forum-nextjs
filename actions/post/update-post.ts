'use server'

import { db } from '@/db/client'

export const updatePostVoteById = async (postId: string, userId: string, voteStatus: 0 | 1 | -1) => {
  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        upVotes:
          voteStatus === 1
            ? {
                connect: {
                  id: userId,
                },
              }
            : {
                disconnect: {
                  id: userId,
                },
              },

        downVotes:
          voteStatus === -1
            ? {
                connect: {
                  id: userId,
                },
              }
            : {
                disconnect: {
                  id: userId,
                },
              },
      },
    })
    return true
  } catch {
    return false
  }
}

export const updatePostBookmarkById = async (postId: string, userId: string, bookmarked: boolean) => {
  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        bookmarks: bookmarked
          ? {
              connect: {
                id: userId,
              },
            }
          : {
              disconnect: {
                id: userId,
              },
            },
      },
    })
    return true
  } catch {
    return false
  }
}
