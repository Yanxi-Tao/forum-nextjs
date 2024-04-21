'use server'

import { getCommunityById, getCommunityBySlug } from '@/data/community'
import { getUserByID } from '@/data/user'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { UpdateCommunitySchemaTypes } from '@/lib/types'
import { UpdateCommunitySchema } from '@/schemas'
import slugify from '@sindresorhus/slugify'
import { revalidatePath } from 'next/cache'

export const updateCommunity = async (data: UpdateCommunitySchemaTypes) => {
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

  const { id, name, description, isPublic, slug } = validatedData.data

  let newSlug = undefined
  if (name !== (await getCommunityById(id))?.name) {
    newSlug = slugify(name)
    if (newSlug === slug) {
      return { type: 'error', message: 'Invalid name' } // in case when the sligified name is the same
    }
    const existingCommunity = await getCommunityBySlug(newSlug)
    if (newSlug === 'create' || existingCommunity) {
      return { type: 'error', message: 'Community already exists' }
    }
  }

  try {
    await db.community.update({
      where: { id },
      data: {
        name,
        slug: newSlug,
        description,
        isPublic,
      },
    })
    revalidatePath('/communities')
    return { type: 'success', message: newSlug ?? slug }
  } catch {
    return { type: 'error', message: 'Error creating community' }
  }
}
