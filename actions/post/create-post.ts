'use server'

import { db } from '@/db/client'

import { z } from 'zod'
import { CreatePostSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export const createPost = async (data: z.infer<typeof CreatePostSchema>) => {
  const validatedData = CreatePostSchema.safeParse(data)
  const user = await currentUser()

  if (!user) {
    return { type: 'error', message: 'User not found' }
  }

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { title, content, type, questionId, communityName } = validatedData.data
  const preview = content.slice(0, 100)

  // Find the community ID by name
  const communityId = communityName
    ? (
        await db.community.findUnique({
          where: { name: communityName },
          select: { id: true },
        })
      )?.id
    : undefined

  try {
    await db.post.create({
      data: {
        slug: slugify(title),
        title,
        content,
        preview,
        type,
        authorId: user.id,
        questionId,
        communityId,
      },
    })
    return { type: 'success', message: 'Post created' }
  } catch {
    return { type: 'error', message: 'Failed to create post' }
  }
}
