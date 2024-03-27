'use server'

import { db } from '@/db/client'

import { z } from 'zod'
import { CreatePostSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { nanoid } from '@/lib/utils'

export const createPost = async (data: z.infer<typeof CreatePostSchema>) => {
  const validatedData = CreatePostSchema.safeParse(data)
  const user = await currentUser()

  if (!user) {
    return { type: 'error', message: 'User not found' }
  }

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { title, content, type, questionId, communityId } = validatedData.data
  const preview = type === 'ANSWER' ? undefined : content.slice(0, 100)

  try {
    await db.post.create({
      data: {
        key: nanoid(),
        title,
        content,
        preview,
        type,
        authorId: user.id,
        questionId,
        communityId,
      },
    })
  } catch {
    return { type: 'error', message: 'Failed to create post' }
  }
}
