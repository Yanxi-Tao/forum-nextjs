'use server'

import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { UpdatePostSchemaTypes } from '@/lib/types'
import { UpdatePostSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'

export const updatePostVoteById = async (
  postId: string,
  userId: string,
  voteStatus: 0 | 1 | -1
) => {
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

export const updatePostBookmarkById = async (
  postId: string,
  userId: string,
  bookmarked: boolean
) => {
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

export const updatePost = async (data: UpdatePostSchemaTypes) => {
  const user = await currentUser()
  if (!user || !user.id) {
    return { type: 'error', message: 'User not found' }
  }
  const validatedData = UpdatePostSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { title, content, postId, pathname, parentUserId, type } =
    validatedData.data

  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        notifications:
          type === 'answer' &&
          parentUserId !== user.id &&
          pathname &&
          parentUserId
            ? {
                upsert: {
                  where: {
                    notifiedUserId_postId_generatedById: {
                      postId,
                      generatedById: user.id,
                      notifiedUserId: parentUserId,
                    },
                  },
                  create: {
                    notifiedUserId: parentUserId,
                    generatedById: user.id,
                    message: 'responded to your question',
                    redirectTo: pathname,
                  },
                  update: {
                    message: 'responded to your question',
                  },
                },
              }
            : undefined,
      },
    })

    if (pathname) revalidatePath(pathname)
    return { type: 'success', message: 'Post created' }
  } catch {
    return { type: 'error', message: 'Failed to create post' }
  }
}
