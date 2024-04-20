'use server'

import { getCommunityBySlug } from '@/data/community'
import { getUserByID } from '@/data/user'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { UpdateCommunitySchema } from '@/schemas'
import slugify from '@sindresorhus/slugify'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const updateCommunity = async (
  data: z.infer<typeof UpdateCommunitySchema>
) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { type: 'error', message: 'Unauthorized' }
  }

  const dbUser = await getUserByID(user.id)

  if (!dbUser) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = UpdateCommunitySchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { id, name, description, isPublic } = validatedData.data

  let slug = undefined
  if (name) {
    slug = slugify(name)
    const existingCommunity = await getCommunityBySlug(slug)
    if (slug === 'create' || existingCommunity) {
      return { type: 'error', message: 'Community already exists' }
    }
  }

  try {
    await db.community.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        isPublic,
      },
    })
    revalidatePath('/communities')
    return { type: 'success', message: slug }
  } catch {
    return { type: 'error', message: 'Error creating community' }
  }
}
