'use server'

import { db } from '@/db/client'

export const updatePostVoteById = async (postId: string, userId: string, voteStatus: number) => {
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
            : voteStatus === 0
            ? {
                disconnect: {
                  id: userId,
                },
              }
            : voteStatus === -1
            ? {
                disconnect: {
                  id: userId,
                },
              }
            : undefined,

        downVotes:
          voteStatus === -1
            ? {
                connect: {
                  id: userId,
                },
              }
            : voteStatus === 0
            ? {
                disconnect: {
                  id: userId,
                },
              }
            : voteStatus === 1
            ? {
                disconnect: {
                  id: userId,
                },
              }
            : undefined,
      },
    })
    return true
  } catch {
    return false
  }
}
