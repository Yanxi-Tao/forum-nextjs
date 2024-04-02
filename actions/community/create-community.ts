'use server'

import { z } from 'zod'
import { CreateCommunitySchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { getUserByID } from '@/data/user'
import { db } from '@/db/client'
import { getCommunityByName } from '@/data/community'

export const createCommunity = async (data: z.infer<typeof CreateCommunitySchema>) => {
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

  const { name, description, isPublic } = data

  const existingCommunity = await getCommunityByName(name)
  if (existingCommunity) {
    return { type: 'error', message: 'Community already exists' }
  }

  try {
    await db.community.create({
      data: {
        name,
        description,
        isPublic,
        ownerId: user.id,
      },
    })
    return { type: 'success', message: 'Community created' }
  } catch {
    return { type: 'error', message: 'Error creating community' }
  }
}
