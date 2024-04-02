'use server'

import { db } from '@/db/client'

export const updateCommentVoteById = async (commentId: string, userId: string, voteStatus: number) => {
  try {
    await db.comment.update({
      where: {
        id: commentId,
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
            : undefined,
      },
    })
    return true
  } catch {
    return false
  }
}
