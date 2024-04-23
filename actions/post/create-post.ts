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

  const { title, content, type, parentId, communitySlug } = validatedData.data
  const communityId = communitySlug
    ? (await getCommunityBySlug(communitySlug))?.id
    : null

  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        type,
        parentId,
        communityId,
        authorId: user.id,
      },
    })
    return { type: 'success', message: 'Post created' }
  } catch {
    return { type: 'error', message: 'Failed to create post' }
  }
}

// await db.post.create({
//   data: {
//     title,
//     content,
//     type,
//     parentId,
//     communityId,
//     authorId: user.id,
//     notifications: {
//       create: [
//         {
//           notifiedUserId: parentUserId,
//           generatedById: user.id,
//           message: 'answered your question',
//           type: 'answer',
//         },
//       ],
//     },
//   },
// })
