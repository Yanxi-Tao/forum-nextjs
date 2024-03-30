'use server'

import { z } from 'zod'
import { CreatePostSchema } from '@/schemas'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

export const createPost = async (data: z.infer<typeof CreatePostSchema>) => {
  const user = await currentUser()
  if (!user) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = CreatePostSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { title, content, type, parentId, communityName } = validatedData.data
  const communityId = communityName
    ? (
        await db.community.findUnique({
          where: { name: communityName },
          select: { id: true },
        })
      )?.id
    : undefined

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

    revalidateTag('posts')
    return { type: 'success', message: 'Post created' }
  } catch {
    return { type: 'error', message: 'Failed to create post' }
  }
}
