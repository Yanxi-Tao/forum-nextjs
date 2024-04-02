'use server'

import { db } from '@/db/client'

export const updateCommentVoteById = async (commentId: string, userId: string, voteStatus: 1 | 0 | -1) => {
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
