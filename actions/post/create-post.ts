'use server'

import { db } from '@/db/client'

import { z } from 'zod'
import { CreatePostSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import slugify from '@sindresorhus/slugify'
import { postNanoid } from '@/lib/utils'
import { revalidatePath, revalidateTag } from 'next/cache'

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
  const slug = `${slugify(title)}-${postNanoid()}`

  // UNDECIDED: do we need to check for duplicate slugs?
  // while (await db.post.findUnique({ where: { slug } })) {
  //   slug = `${slugify(title)}-${postNanoid()}`
  // }

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
        slug,
        title,
        content,
        preview,
        type,
        authorId: user.id,
        questionId,
        communityId,
      },
    })

    // invalidate cache when answer is created
    revalidateTag('answers') // answer list
    revalidateTag('posts') // post list
    revalidateTag('post') // question page
    return { type: 'success', message: 'Post created' }
  } catch (e) {
    console.error(e)
    return { type: 'error', message: 'Failed to create post' }
  }
}
