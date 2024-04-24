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

  const { id, description, isPublic } = validatedData.data

  try {
    await db.community.update({
      where: { id },
      data: {
        description,
        isPublic,
      },
    })
    revalidatePath('/communities')
    return { type: 'success', message: 'Community created successfully' }
  } catch {
    return { type: 'error', message: 'Error creating community' }
  }
}
