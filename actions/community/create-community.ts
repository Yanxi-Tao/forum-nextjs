'use server'

import { CreateCommunitySchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { getUserByID } from '@/data/user'
import { db } from '@/db/client'
import { getCommunityBySlug } from '@/data/community'
import slugify from '@sindresorhus/slugify'
import { revalidatePath } from 'next/cache'
import { CreateCommunitySchemaTypes } from '@/lib/types'

export const createCommunity = async (data: CreateCommunitySchemaTypes) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { type: 'error', message: 'Unauthorized' }
  }

  const dbUser = await getUserByID(user.id)

  if (!dbUser) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = CreateCommunitySchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { name, description, isPublic } = validatedData.data

  const slug = slugify(name)
  const existingCommunity = await getCommunityBySlug(slug)
  if (slug === 'create' || existingCommunity) {
    return { type: 'error', message: 'Community already exists' }
  }

  try {
    await db.community.create({
      data: {
        name,
        slug,
        description,
        isPublic,
        ownerId: user.id,
      },
    })
    revalidatePath('/communities')
    return { type: 'success', message: slug }
  } catch {
    return { type: 'error', message: 'Error creating community' }
  }
}
