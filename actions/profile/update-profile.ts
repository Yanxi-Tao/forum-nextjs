'use server'

import { getUserByID } from '@/data/user'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { UpdateProfileSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const updateProfile = async (
  data: z.infer<typeof UpdateProfileSchema>
) => {
  const user = await currentUser()
  if (!user || !user.id) {
    return { type: 'error', message: 'Unauthorized' }
  }

  const dbUser = await getUserByID(user.id)

  if (!dbUser) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = UpdateProfileSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  try {
    // update user profile
    await db.profile.update({
      where: { userId: user.id },
      data: {
        bio: data.bio,
      },
    })
    revalidatePath('/profile')
    return { type: 'success', message: 'Profile updated' }
  } catch {
    return { type: 'error', message: 'Error updating profile' }
  }
}
