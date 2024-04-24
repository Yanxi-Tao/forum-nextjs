'use server'

import { CreatePostSchema } from '@/schemas'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { getCommunityBySlug } from '@/data/community'
import { CreatePostSchemaTypes } from '@/lib/types'

export const createPost = async (data: CreatePostSchemaTypes) => {
  const user = await currentUser()
  if (!user || !user.id) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = CreatePostSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const {
    title,
    content,
    type,
    parentId,
    communitySlug,
    parentUserId,
    pathname,
  } = validatedData.data
  const communityId = communitySlug
    ? (await getCommunityBySlug(communitySlug))?.id
    : null

  try {
    await db.post.create({
      data: {
        title,
        content,
        type,
        parentId,
        communityId,
        authorId: user.id,
        notifications:
          type === 'answer' &&
          parentUserId &&
          parentUserId !== user.id &&
          pathname
            ? {
                create: [
                  {
                    notifiedUserId: parentUserId,
                    generatedById: user.id,
                    message: '13e',
                    redirectTo: pathname,
                  },
                ],
              }
            : undefined,
      },
    })
    return { type: 'success', message: 'Post created' }
  } catch {
    return { type: 'error', message: 'Failed to create post' }
  }
}
